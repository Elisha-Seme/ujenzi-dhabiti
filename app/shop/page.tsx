import { redirect } from "next/navigation";

// The shop is the house-plans store. /shop redirects to the plans catalogue so
// older links and the "Shop" nav item land in the right place.
export default function ShopPage() {
  redirect("/shop/plans");
}
