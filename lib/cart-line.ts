/** Cart line key: one line per product + delivery mode (materials use "std"). */
export function cartLineId(productId: string, deliveryMode?: string): string {
  return `${productId}::${deliveryMode ?? "std"}`;
}
