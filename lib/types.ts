export interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  bullets: string[];
}

export interface Project {
  id: number;
  name: string;
  location: string;
  category: string;
  description: string;
  image: string;
}

export interface TeamMember {
  name: string;
  title: string;
  image: string | null;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type CartItemKind = "material" | "plan";
export type DeliveryMode = "digital" | "print";

export interface CartItem {
  lineId: string; // unique per product + delivery mode
  productId: string;
  kind: CartItemKind;
  name: string;
  unit: string;
  priceKES: number; // resolved price for the chosen delivery mode
  quantity: number;
  image: string;
  sellerId: string; // "" for house plans (sold by Ujenzi Dhabiti)
  sellerName: string;
  deliveryMode?: DeliveryMode; // only set for house plans
}

export type PaymentMethod = "mpesa" | "card" | "bank";

export interface Order {
  id: string;
  items: CartItem[];
  subtotalKES: number;
  platformFeeKES: number;
  totalKES: number;
  paymentMethod: PaymentMethod;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryAddress: string;
  createdAt: string;
}
