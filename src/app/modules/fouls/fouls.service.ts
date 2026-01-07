import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IFouls } from './fouls.interface';
import Fouls from './fouls.model';

const createFouls = async (userId: string, payload: IFouls) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IFouls> = { ...payload };
  if (user.role === userRole.player) {
    data.player = user._id;
  }
  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await Fouls.create(data);
  if (!result) throw new AppError(400, 'Failed to create fouls');
  return result;
};

const getAllFouls = async (
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

  const result = await Fouls.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Fouls stats not found');
  }

  const total = await Fouls.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleFouls = async (id: string) => {
  const result = await Fouls.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Fouls stats not found');
  }

  return result;
};

const updateFouls = async (id: string, payload: Partial<IFouls>) => {
  const result = await Fouls.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Fouls stats not found');
  }

  return result;
};

const deleteFouls = async (id: string) => {
  const result = await Fouls.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Fouls stats not found');
  }

  return result;
};

export const foulsService = {
  createFouls,
  getAllFouls,
  getSingleFouls,
  updateFouls,
  deleteFouls,
};
