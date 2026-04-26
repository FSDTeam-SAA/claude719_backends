export interface ICoupon {
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: Date;
  appliesTo: string;
  isActive: boolean;
}

export interface ICouponMethods {
  applyDiscount(originalPrice: number): number | null;
}

export interface ICouponVirtuals {
  isValid: boolean;
}
