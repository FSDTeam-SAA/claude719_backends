import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IAttackingstat } from './attackingstat.interface';
import Attackingstat from './attackingstat.model';

const createAttackingstat = async (userId: string, payload: IAttackingstat) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IAttackingstat> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }

  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await Attackingstat.create(data);
  if (!result) throw new AppError(400, 'Failed to create attacking stat');

  return result;
};

const createOrUpdateAttackingstat = async (
  userId: string,
  payload: IAttackingstat,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let filter: any = {};
  let incData: any = {};
  let setOnInsertData: any = {};

  const numericFields = [
    'goals',
    'assists',
    'shotsNsidePr',
    'shotsOutsidePa',
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

  const result = await Attackingstat.findOneAndUpdate(
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

const getAllAttackingstat = async (
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

  const result = await Attackingstat.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  const total = await Attackingstat.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleAttackingstat = async (id: string) => {
  const result = await Attackingstat.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Attackingstat not found');
  }

  return result;
};

const updateAttackingstat = async (
  id: string,
  payload: Partial<IAttackingstat>,
) => {
  const result = await Attackingstat.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  return result;
};

const deleteAttackingstat = async (id: string) => {
  const result = await Attackingstat.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};

export const attackingstatService = {
  createAttackingstat,
  createOrUpdateAttackingstat,
  getAllAttackingstat,
  getSingleAttackingstat,
  updateAttackingstat,
  deleteAttackingstat,
};
