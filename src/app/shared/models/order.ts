import { CartItem } from "./cartItems";

export class Order {
  id!: string;
  items!: CartItem[];
  totalPrice!: number;
  name!: string;
  number!: number;
  address!: string;
  pincode!: number;
  deliveryCharge!: number;
  createdAt!: string;
  user!: string;
  razorpayOrderId!: string;
  razorpayPaymentId?: string;
  status!: string;
}