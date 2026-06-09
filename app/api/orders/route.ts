import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, payments, products } from "@/lib/db";
import { and, inArray, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { planPrice, planSnapshotName, DeliveryMode } from "@/lib/house-plans";
import { getAllPlans } from "@/lib/plans-store";
import { depositFor } from "@/lib/constants";

interface CartItem {
  productId: string;
  quantity: number;
  deliveryMode?: DeliveryMode;
}

type ClientPaymentMethod = "mpesa" | "card" | "flutterwave" | "bank";
type StoredPaymentMethod = "mpesa" | "flutterwave" | "bank";

interface ResolvedItem {
  productId: string | null; // null for house plans (not in products table)
  quantity: number;
  priceKES: number;
  productName: string;
  productImage: string;
  sellerId: string | null;
  sellerName: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      guestName, guestEmail, guestPhone,
      deliveryAddress, deliveryCity, deliveryCounty,
      paymentMethod,
      payDeposit,
      items,
    }: {
      guestName?: string; guestEmail?: string; guestPhone?: string;
      deliveryAddress?: string; deliveryCity?: string; deliveryCounty?: string;
      paymentMethod: ClientPaymentMethod;
      payDeposit?: boolean;
      items: CartItem[];
    } = body;

    if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!paymentMethod) return NextResponse.json({ error: "Payment method required" }, { status: 400 });
    const storedPaymentMethod: StoredPaymentMethod =
      paymentMethod === "card" ? "flutterwave" : paymentMethod;
    if (!["mpesa", "flutterwave", "bank"].includes(storedPaymentMethod)) {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }

    const buyerName = session?.user?.name ?? guestName;
    const buyerEmail = session?.user?.email ?? guestEmail;
    if (!buyerName || !buyerEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // ─── Sanitize + dedupe by product + delivery mode ─────────────
    const dedup = new Map<string, CartItem>();
    for (const i of items) {
      if (!i?.productId) continue;
      if (!Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 999) continue;
      const mode: DeliveryMode | undefined =
        i.deliveryMode === "digital" || i.deliveryMode === "print" ? i.deliveryMode : undefined;
      const key = `${i.productId}::${mode ?? "std"}`;
      const existing = dedup.get(key);
      dedup.set(key, { productId: i.productId, deliveryMode: mode, quantity: (existing?.quantity ?? 0) + i.quantity });
    }
    const sanitized = Array.from(dedup.values());
    if (sanitized.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // Single-vendor: split into house plans (server-trusted catalogue) and
    // materials (DB). Everything is sold by Ujenzi Dhabiti.
    const allPlans = await getAllPlans();
    const planMap = new Map(allPlans.map((p) => [p.id, p]));
    const planEntries = sanitized.filter((i) => planMap.has(i.productId));
    const materialEntries = sanitized.filter((i) => !planMap.has(i.productId));

    const resolvedItems: ResolvedItem[] = [];
    let subtotalKES = 0;
    let hasPhysical = false;

    // ─── House plans (price comes from the server module) ──────────
    for (const entry of planEntries) {
      const plan = planMap.get(entry.productId)!;
      const mode: DeliveryMode = entry.deliveryMode ?? "digital";
      const qty = mode === "digital" ? 1 : entry.quantity; // digital = single copy
      const price = planPrice(plan, mode);
      if (mode === "print") hasPhysical = true;
      resolvedItems.push({
        productId: null,
        quantity: qty,
        priceKES: price,
        productName: planSnapshotName(plan, mode),
        productImage: plan.image,
        sellerId: null,
        sellerName: "Ujenzi Dhabiti",
      });
      subtotalKES += price * qty;
    }

    // ─── Materials from the DB (never trust client prices) ─────────
    if (materialEntries.length > 0) {
      hasPhysical = true;
      const productIds = materialEntries.map((i) => i.productId);
      const productRows = await db
        .select({
          id: products.id,
          name: products.name,
          priceKES: products.priceKES,
          images: products.images,
        })
        .from(products)
        .where(and(inArray(products.id, productIds), eq(products.isActive, true)));
      const productMap = Object.fromEntries(productRows.map((p) => [p.id, p]));

      for (const entry of materialEntries) {
        const product = productMap[entry.productId];
        if (!product) {
          return NextResponse.json(
            { error: `Product ${entry.productId} is unavailable or out of stock` },
            { status: 400 }
          );
        }
        resolvedItems.push({
          productId: product.id,
          quantity: entry.quantity,
          priceKES: product.priceKES,
          productName: product.name,
          productImage: product.images[0] ?? "",
          sellerId: null,
          sellerName: "Ujenzi Dhabiti",
        });
        subtotalKES += product.priceKES * entry.quantity;
      }
    }

    if (subtotalKES < 1) {
      return NextResponse.json({ error: "Order total must be at least KES 1" }, { status: 400 });
    }

    // ─── Delivery details: required only when something ships ──────
    let finalAddress = deliveryAddress;
    let finalCity = deliveryCity;
    if (hasPhysical) {
      if (!deliveryAddress || !deliveryCity) {
        return NextResponse.json({ error: "Delivery address required" }, { status: 400 });
      }
    } else {
      finalAddress = "Digital download — delivered by email";
      finalCity = "N/A";
    }

    const platformFeeKES = 0; // single-vendor: no marketplace fee
    const totalKES = subtotalKES;

    // Deposit orders: charge a part-payment now, balance on delivery. Only
    // honoured when the order qualifies (server-side check, never trust client).
    const depositKES = payDeposit ? depositFor(totalKES) : null;
    const amountDueNowKES = depositKES ?? totalKES;

    const orderId = "UD-" + randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();

    const loggedInUserId = session?.user?.id ?? null;
    await db.insert(orders).values({
      id: orderId,
      buyerId: loggedInUserId,
      guestName: buyerName,
      guestEmail: buyerEmail,
      guestPhone: guestPhone ?? null,
      deliveryAddress: finalAddress!,
      deliveryCity: finalCity!,
      deliveryCounty: deliveryCounty ?? null,
      subtotalKES,
      platformFeeKES,
      totalKES,
      depositKES,
      status: "pending",
      paymentMethod: storedPaymentMethod,
    });

    await db.insert(orderItems).values(
      resolvedItems.map((item) => ({
        id: randomUUID(),
        orderId,
        productId: item.productId,
        sellerId: item.sellerId,
        productName: item.productName,
        productImage: item.productImage,
        sellerName: item.sellerName,
        priceKES: item.priceKES,
        quantity: item.quantity,
      }))
    );

    const paymentId = randomUUID();
    await db.insert(payments).values({
      id: paymentId,
      orderId,
      provider: storedPaymentMethod,
      status: "initiated",
      amountKES: amountDueNowKES,
    });

    return NextResponse.json({
      orderId,
      paymentId,
      totalKES,
      depositKES,
      amountDueNowKES,
      buyerEmail,
      buyerName,
    });
  } catch (err) {
    console.error("[POST /api/orders] FULL ERROR:", err);
    const cause = (err as { cause?: unknown })?.cause;
    if (cause) console.error("[POST /api/orders] DB CAUSE:", cause);
    const causeMessage = cause instanceof Error ? cause.message : null;
    const message = causeMessage ?? (err instanceof Error ? err.message : "Failed to create order");
    return NextResponse.json({ error: message, cause: causeMessage }, { status: 500 });
  }
}
