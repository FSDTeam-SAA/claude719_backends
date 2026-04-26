import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { ICoupon } from './copon.interface';
import Coupon from './copon.model';

const createCopon = async (payload: Partial<ICoupon>) => {
  const exist = await Coupon.findOne({ code: payload.code });
  if (exist) throw new AppError(400, 'Copon already exists');
  const copon = await Coupon.create(payload);
  return copon;
};

const getAllCopon = async (params: any, options: IOption) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const andCondition = [];
  const searchTermFor = ['code', 'event', 'offer'];

  if (searchTerm) {
    andCondition.push({
      $or: searchTermFor.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Coupon.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  const total = await Coupon.countDocuments(whereCondition);
  return { data: result, meta: { total, page, limit } };
};

const getSingleCopon = async (id: string) => {
  const result = await Coupon.findById(id);
  if (!result) throw new AppError(404, 'Copon not found');
  return result;
};

const getSingleCoponCode = async (code: string) => {
  const result = await Coupon.findOne({ code });
  if (!result) throw new AppError(404, 'Copon not found');
  return result;
};

const updateCopon = async (id: string, payload: Partial<ICoupon>) => {
  const result = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'Copon not found');
  return result;
};

const deleteCopon = async (id: string) => {
  const result = await Coupon.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Copon not found');
  return result;
};

const applyCopon = async (payload: { code: string; originalPrice: number }) => {
  const { code, originalPrice } = payload;
  const coupon = await Coupon.findOne({ code });
  
  if (!coupon) {
    throw new AppError(404, 'Coupon not found');
  }

  if (!coupon.isValid) {
    throw new AppError(400, 'Coupon is invalid or expired');
  }

  const discountedPrice = coupon.applyDiscount(originalPrice);
  if (discountedPrice === null) {
    throw new AppError(400, 'Failed to apply coupon');
  }

  const savedAmount = originalPrice - discountedPrice;

  return {
    couponId: coupon._id,
    code: coupon.code,
    originalPrice,
    discountedPrice,
    savedAmount,
  };
};

export const coponService = {
  createCopon,
  getAllCopon,
  applyCopon,
  getSingleCopon,
  getSingleCoponCode,
  updateCopon,
  deleteCopon,
};
