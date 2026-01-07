import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IGkstats } from './gkstats.interface';
import Gkstats from './gkstats.model';

const createGkStats = async (userId: string, payload: IGkstats) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IGkstats> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }
  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await Gkstats.create(data);
  if (!result) throw new AppError(400, 'Failed to create GK stats');

  return result;
};

const getAllGKStats = async (
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

  const result = await Gkstats.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'GKStats stats not found');
  }

  const total = await Gkstats.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleGKStats = async (id: string) => {
  const result = await Gkstats.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'GKStats stats not found');
  }

  return result;
};

const updateGKStats = async (id: string, payload: Partial<IGkstats>) => {
  const result = await Gkstats.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'GKStats stats not found');
  }

  return result;
};

const deleteGKStats = async (id: string) => {
  const result = await Gkstats.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'GKStats stats not found');
  }

  return result;
};

export const gkstatsService = {
  createGkStats,
  getAllGKStats,
  getSingleGKStats,
  updateGKStats,
  deleteGKStats,
};
