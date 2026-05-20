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

export interface CartItem {
  productId: string;
  name: string;
  unit: string;
  priceKES: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
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
