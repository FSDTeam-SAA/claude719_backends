import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IMarketvalue } from './marketvalue.interface';
import Marketvalue from './marketvalue.model';

const createMarketvalue = async (userId: string, payload: IMarketvalue) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IMarketvalue> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }

  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await Marketvalue.create(data);
  if (!result) throw new AppError(400, 'Failed to create market value');

  return result;
};

const getAllMarketvalue = async (
  userId: string,
  //   params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'user is not found');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  //   const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  //   const userSearchableFields = ['firstName', 'lastName', 'email', 'role'];

  //   if (searchTerm) {
  //     andCondition.push({
  //       $or: userSearchableFields.map((field) => ({
  //         [field]: { $regex: searchTerm, $options: 'i' },
  //       })),
  //     });
  //   }

  //   if (Object.keys(filterData).length) {
  //     andCondition.push({
  //       $and: Object.entries(filterData).map(([field, value]) => ({
  //         [field]: value,
  //       })),
  //     });
  //   }

  if (user.role === userRole.player) andCondition.push({ player: user._id });
  if (user.role === userRole.gk) andCondition.push({ gk: user._id });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Marketvalue.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Market value not found');
  }

  const total = await Marketvalue.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleMarketvalue = async (id: string) => {
  const result = await Marketvalue.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Market value not found');
  }

  return result;
};

const updateMarketvalue = async (
  id: string,
  payload: Partial<IMarketvalue>,
) => {
  const result = await Marketvalue.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Market value not found');
  }

  return result;
};

const deleteMarketvalue = async (id: string) => {
  const result = await Marketvalue.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Market value not found');
  }

  return result;
};

export const marketvalueService = {
  createMarketvalue,
  getAllMarketvalue,
  getSingleMarketvalue,
  updateMarketvalue,
  deleteMarketvalue,
};
