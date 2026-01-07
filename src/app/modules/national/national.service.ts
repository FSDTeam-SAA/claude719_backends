import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { INational } from './national.interface';
import National from './national.model';

const createNational = async (
  userId: string,
  payload: Partial<INational>,
  flag?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'user is not found');

  if (flag) {
    const leftClubUrl = await fileUploader.uploadToCloudinary(flag);
    payload.flag = leftClubUrl.url;
  }

  if (user.role === userRole.player) {
    const result = await National.create({
      ...payload,
      player: user._id,
    });
    return result;
  }
  if (user.role === userRole.gk) {
    const result = await National.create({
      ...payload,
      gk: user._id,
    });
    return result;
  }
};

const getAllNational = async (
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

  const result = await National.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  const total = await National.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleNational = async (id: string) => {
  const result = await National.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  return result;
};

const updateNational = async (
  id: string,
  payload: Partial<INational>,
  flag?: Express.Multer.File,
) => {
  if (flag) {
    const leftClubUrl = await fileUploader.uploadToCloudinary(flag);
    payload.flag = leftClubUrl.url;
  }

  const result = await National.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'National not found');
  }

  return result;
};

const deletenational = async (id: string) => {
  const result = await National.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};
export const nationalService = {
  createNational,
  getAllNational,
  getSingleNational,
  updateNational,
  deletenational,
};
