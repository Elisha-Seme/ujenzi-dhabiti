import { NextResponse } from "next/server";
import { getAllPlans } from "@/lib/plans-store";

// Public house-plan catalogue — DB when seeded, static fallback otherwise.
export async function GET() {
  const plans = await getAllPlans();
  return NextResponse.json({ plans });
}
