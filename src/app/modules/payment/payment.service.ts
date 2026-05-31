import pagination, { IOption } from '../../helper/pagenation';
import Payment from './payment.model';

const getAllPayments = async (params: any, options: IOption) => {
  const { searchTerm, ...filterData } = params;
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const andCondition = [];
  const saerchableFields = ['paymentMethod', 'status'];

  if (searchTerm) {
    andCondition.push({
      $or: saerchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Payment.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('user')
    .populate('subscription')
    .populate('team');
  const total = await Payment.countDocuments(whereCondition);
  return { data: result, meta: { total, page, limit } };
};

const getPaymentById = async (id: string) => {
  const result = await Payment.findById(id)
    .populate('user')
    .populate('subscription')
    .populate('team');
  return result;
};

export const PaymentService = { getAllPayments, getPaymentById };
