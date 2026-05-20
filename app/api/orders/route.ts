import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, products, sellers, payments } from "@/lib/db";
import { eq, and, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";

const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 3);

interface CartItem {
  productId: string;
  quantity: number;
}

type ClientPaymentMethod = "mpesa" | "card" | "flutterwave" | "bank";
type StoredPaymentMethod = "mpesa" | "flutterwave" | "bank";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const {
      guestName, guestEmail, guestPhone,
      deliveryAddress, deliveryCity, deliveryCounty,
      paymentMethod,
      items,
    }: {
      guestName?: string; guestEmail?: string; guestPhone?: string;
      deliveryAddress: string; deliveryCity: string; deliveryCounty?: string;
      paymentMethod: ClientPaymentMethod;
      items: CartItem[];
    } = body;

    // Validate
    if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!deliveryAddress || !deliveryCity) return NextResponse.json({ error: "Delivery address required" }, { status: 400 });
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

    // Sanitize items: dedupe, validate quantities, drop bad entries
    const validItems = items
      .filter((i) => i?.productId && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 999)
      .reduce<Map<string, number>>((acc, i) => {
        acc.set(i.productId, (acc.get(i.productId) ?? 0) + i.quantity);
        return acc;
      }, new Map());

    if (validItems.size === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // Fetch ONLY the requested products (never trust client-side prices)
    const productIds = Array.from(validItems.keys());
    const productRows = await db
      .select({
        id: products.id,
        name: products.name,
        priceKES: products.priceKES,
        stock: products.stock,
        images: products.images,
        sellerId: products.sellerId,
        sellerName: sellers.businessName,
        isActive: products.isActive,
      })
      .from(products)
      .innerJoin(sellers, eq(products.sellerId, sellers.id))
      .where(and(inArray(products.id, productIds), eq(products.isActive, true)));

    const productMap = Object.fromEntries(productRows.map((p) => [p.id, p]));

    // Validate each item and calculate totals
    let subtotalKES = 0;
    const resolvedItems: {
      productId: string; quantity: number; priceKES: number;
      productName: string; productImage: string;
      sellerId: string; sellerName: string;
    }[] = [];

    for (const [productId, quantity] of Array.from(validItems.entries())) {
      const product = productMap[productId];
      if (!product) {
        return NextResponse.json(
          { error: `Product ${productId} is unavailable or out of stock` },
          { status: 400 }
        );
      }
      resolvedItems.push({
        productId: product.id,
        quantity,
        priceKES: product.priceKES,
        productName: product.name,
        productImage: product.images[0] ?? "",
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      });
      subtotalKES += product.priceKES * quantity;
    }

    // Minimum amount check (Daraja and most gateways have a KES 1 minimum)
    if (subtotalKES < 1) {
      return NextResponse.json({ error: "Order total must be at least KES 1" }, { status: 400 });
    }

    const platformFeeKES = Math.round(subtotalKES * PLATFORM_FEE_PERCENT / 100);
    const totalKES = subtotalKES + platformFeeKES;

    // Generate order ID: UD- + 6 uppercase alphanumeric chars
    const orderId = "UD-" + randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();

    // Always save the contact details that came in via the form, even when the
    // user is logged in. That way notifications work even if the user account
    // gets deleted later (guestEmail acts as a permanent record of where this
    // order came from). buyerId still links to the user when available.
    const loggedInUserId = session?.user?.id ?? null;
    await db.insert(orders).values({
      id: orderId,
      buyerId: loggedInUserId,
      guestName: buyerName,
      guestEmail: buyerEmail,
      guestPhone: guestPhone ?? null,
      deliveryAddress,
      deliveryCity,
      deliveryCounty: deliveryCounty ?? null,
      subtotalKES,
      platformFeeKES,
      totalKES,
      status: "pending",
      paymentMethod: storedPaymentMethod,
    });

    // Insert order items
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

    // Create a pending payment record
    const paymentId = randomUUID();
    await db.insert(payments).values({
      id: paymentId,
      orderId,
      provider: storedPaymentMethod,
      status: "initiated",
      amountKES: totalKES,
    });

    return NextResponse.json({
      orderId,
      paymentId,
      totalKES,
      buyerEmail,
      buyerName,
    });
  } catch (err) {
    console.error("[POST /api/orders] FULL ERROR:", err);
    // Drizzle wraps DB errors and stashes the real cause on `.cause`
    const cause = (err as { cause?: unknown })?.cause;
    if (cause) console.error("[POST /api/orders] DB CAUSE:", cause);
    const causeMessage = cause instanceof Error ? cause.message : null;
    const message = causeMessage ?? (err instanceof Error ? err.message : "Failed to create order");
    return NextResponse.json({ error: message, cause: causeMessage }, { status: 500 });
  }
}
