import mongoose from 'mongoose';
import { ICoupon, ICouponMethods, ICouponVirtuals } from './copon.interface';

type CouponModel = mongoose.Model<ICoupon, {}, ICouponMethods, ICouponVirtuals>;

const couponSchema = new mongoose.Schema<
  ICoupon,
  CouponModel,
  ICouponMethods,
  {},
  ICouponVirtuals
>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    discountType: {
      type: String,
      enum: ['percent', 'flat'],
      required: true,
      default: 'percent',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value required'],
      min: [1, 'Discount must be at least 1'],
    },
    maxUses: {
      type: Number,
      required: [true, 'Max usage limit required'],
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date required'],
    },
    appliesTo: {
      type: String,
      default: 'all',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Virtual: check if coupon is currently valid
couponSchema.virtual('isValid').get(function () {
  const notExpired = new Date() < new Date(this.expiryDate);
  const hasUsesLeft = this.usedCount < this.maxUses;
  return this.isActive && notExpired && hasUsesLeft;
});

// Method: calculate final price after discount
couponSchema.methods.applyDiscount = function (originalPrice: number) {
  if (!this.isValid) return null;
  if (this.discountType === 'percent') {
    const discount = (originalPrice * this.discountValue) / 100;
    return parseFloat((originalPrice - discount).toFixed(2));
  }
  return parseFloat(Math.max(0, originalPrice - this.discountValue).toFixed(2));
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
