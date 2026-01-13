import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IGkDistributionStats } from './gkdistributionstats.interface';
import GkDistributionStats from './gkdistributionstats.model';

const createGkDistributionstats = async (
  userId: string,
  payload: IGkDistributionStats,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IGkDistributionStats> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }

  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await GkDistributionStats.create(data);
  if (!result)
    throw new AppError(400, 'Failed to create GK distribution stats');

  return result;
};

const getAllGkDistributionstats = async (
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

  const result = await GkDistributionStats.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Gk Distribution stats not found');
  }

  const total = await GkDistributionStats.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleGkDistributionstats = async (id: string) => {
  const result = await GkDistributionStats.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Gk Distribution stats not found');
  }

  return result;
};

const updateGkDistributionstats = async (
  id: string,
  payload: Partial<IGkDistributionStats>,
) => {
  const result = await GkDistributionStats.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Gk Distribution stats not found');
  }

  return result;
};

const deleteGkDistributionstats = async (id: string) => {
  const result = await GkDistributionStats.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Gk Distribution stats not found');
  }

  return result;
};

export const gkDistributionstatsService = {
  createGkDistributionstats,
  getAllGkDistributionstats,
  getSingleGkDistributionstats,
  updateGkDistributionstats,
  deleteGkDistributionstats,
};
