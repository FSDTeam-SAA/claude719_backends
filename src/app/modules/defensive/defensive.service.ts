import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IDefensive } from './defensive.interface';
import Defensive from './defensive.model';

const createDefensive = async (
  userId: string,
  payload: Partial<IDefensive>,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'user is not found');

  if (user.role === userRole.player) {
    const result = await Defensive.create({
      ...payload,
      player: user._id,
    });
    return result;
  }
  if (user.role === userRole.gk) {
    const result = await Defensive.create({
      ...payload,
      gk: user._id,
    });
    return result;
  }
};

const createOrUpdateDefensive = async (userId: string, payload: IDefensive) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let filter: any = {};
  let incData: any = {};
  let setOnInsertData: any = {};

  const numericFields = [
    'tackleAttempts',
    'tackleSucceededPossession',
    'tackleSucceededNOPossession',
    'tackleFailed',
    'turnoverwon',
    'interceptions',
    'recoveries',
    'clearance',
    'totalBlocked',
    'shotBlocked',
    'crossBlocked',
    'mistakes',
    'aerialDuels',
    'phvsicalDuels',
    'ownGoals',
  ] as const;

  numericFields.forEach((field) => {
    if (payload[field] !== undefined) {
      incData[field] = payload[field];
    }
  });

  if (user.role === userRole.player) {
    filter.player = user._id;
    setOnInsertData.player = user._id;
  }

  if (user.role === userRole.gk) {
    filter.gk = user._id;
    setOnInsertData.gk = user._id;
  }

  const result = await Defensive.findOneAndUpdate(
    filter,
    {
      $inc: incData,
      $setOnInsert: setOnInsertData,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return result;
};

const getAllDefensive = async (
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

  const result = await Defensive.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Defensive not found');
  }

  const total = await Defensive.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleDefensive = async (id: string) => {
  const result = await Defensive.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  return result;
};

const updateNational = async (id: string, payload: Partial<IDefensive>) => {
  const result = await Defensive.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  return result;
};

const deleteDefensive = async (id: string) => {
  const result = await Defensive.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};
export const defensiveService = {
  createDefensive,
  createOrUpdateDefensive,
  getAllDefensive,
  getSingleDefensive,
  updateNational,
  deleteDefensive,
};
