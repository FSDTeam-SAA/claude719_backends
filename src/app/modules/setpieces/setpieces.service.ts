import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { ISetpieces } from './setpieces.interface';
import Setpieces from './setpieces.model';

const createSetpieces = async (userId: string, payload: ISetpieces) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<ISetpieces> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }

  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await Setpieces.create(data);
  if (!result) throw new AppError(400, 'Failed to create setpieces');
  return result;
};

const getAllSetpieces = async (
  userId: string,
  //   params: any,
  options: IOption,
) => {
  console.log('hello world');
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

  const result = await Setpieces.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Setpieces stats not found');
  }

  const total = await Setpieces.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleSetpieces = async (id: string) => {
  const result = await Setpieces.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Setpieces stats not found');
  }

  return result;
};

const updateSetpieces = async (id: string, payload: Partial<ISetpieces>) => {
  const result = await Setpieces.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Setpieces stats not found');
  }

  return result;
};

const deleteSetpieces = async (id: string) => {
  const result = await Setpieces.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Setpieces stats not found');
  }

  return result;
};

export const setpiecesService = {
  createSetpieces,
  getAllSetpieces,
  getSingleSetpieces,
  updateSetpieces,
  deleteSetpieces,
};
