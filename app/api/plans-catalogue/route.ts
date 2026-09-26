import { NextResponse } from "next/server";
import { getAllPlans } from "@/lib/plans-store";

// Public house-plan catalogue — DB when seeded, static fallback otherwise.
// It must be dynamic: the CMS catalogue can change without a rebuild.
export const dynamic = "force-dynamic";

export async function GET() {
  const plans = await getAllPlans();
  return NextResponse.json({ plans });
}
