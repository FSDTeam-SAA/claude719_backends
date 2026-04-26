import { Document, Types } from 'mongoose';

export interface ICouponUsage extends Document {
  coupon: Types.ObjectId;
  couponCode: string;
  user: Types.ObjectId;
  eventName: string;
  originalPrice: number;
  discountedPrice: number;
  savedAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paypalOrderId: string | null;
  paypalTransactionId: string | null;
}