import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IPlayerReport } from './playerreport.interface';
import PlayerReport from './playerreport.model';

const createPlayerreport = async (userId: string, payload: IPlayerReport) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let data: Partial<IPlayerReport> = { ...payload };

  if (user.role === userRole.player) {
    data.player = user._id;
  }

  if (user.role === userRole.gk) {
    data.gk = user._id;
  }

  const result = await PlayerReport.create(data);
  if (!result) throw new AppError(400, 'Player report to create setpieces');
  return result;
};

const getAllPlayerreport = async (
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

  const result = await PlayerReport.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Player Report stats not found');
  }

  const total = await PlayerReport.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSinglePlayerreport = async (id: string) => {
  const result = await PlayerReport.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'Player Report stats not found');
  }

  return result;
};

const updatePlayerreport = async (
  id: string,
  payload: Partial<IPlayerReport>,
) => {
  const result = await PlayerReport.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Player Report stats not found');
  }

  return result;
};

const deletePlayerreport = async (id: string) => {
  const result = await PlayerReport.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Player Report stats not found');
  }

  return result;
};

export const playerReportService = {
  createPlayerreport,
  getAllPlayerreport,
  getSinglePlayerreport,
  updatePlayerreport,
  deletePlayerreport,
};
