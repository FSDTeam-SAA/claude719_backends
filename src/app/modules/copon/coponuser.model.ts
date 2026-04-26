import mongoose from 'mongoose';

const couponUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    savedAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paypalOrderId: {
      type: String,
      default: null,
    },
    paypalTransactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const CouponUsage = mongoose.model('CouponUsage', couponUsageSchema);
export default CouponUsage;
