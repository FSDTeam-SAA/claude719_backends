import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { ITransferhistory } from './transferhistory.interface';
import TransferHistory from './transferhistory.model';

const createTransferhistory = async (
  userId: string,
  payload: Partial<ITransferhistory>,
  leftClub?: Express.Multer.File,
  leftCountery?: Express.Multer.File,
  joinedClub?: Express.Multer.File,
  joinedCountery?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'user is not found');

  if (leftClub) {
    const leftClubUrl = await fileUploader.uploadToCloudinary(leftClub);
    payload.leftClub = leftClubUrl.url;
  }
  if (leftCountery) {
    const leftCounteryUrl = await fileUploader.uploadToCloudinary(leftCountery);
    payload.leftCountery = leftCounteryUrl.url;
  }

  if (joinedClub) {
    const joinedClubUrl = await fileUploader.uploadToCloudinary(joinedClub);
    payload.joinedClub = joinedClubUrl.url;
  }

  if (joinedCountery) {
    const joinedCounteryUrl =
      await fileUploader.uploadToCloudinary(joinedCountery);
    payload.joinedCountery = joinedCounteryUrl.url;
  }

  if (user.role === userRole.player) {
    const result = await TransferHistory.create({
      ...payload,
      player: user._id,
    });
    return result;
  }
  if (user.role === userRole.gk) {
    const result = await TransferHistory.create({
      ...payload,
      gk: user._id,
    });
    return result;
  }
};

const getAllTransferhistory = async (
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

  const result = await TransferHistory.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  const total = await TransferHistory.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleTransferhistory = async (id: string) => {
  const result = await TransferHistory.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};

const updateTransferhistory = async (
  id: string,
  payload: Partial<ITransferhistory>,
  leftClub?: Express.Multer.File,
  leftCountery?: Express.Multer.File,
  joinedClub?: Express.Multer.File,
  joinedCountery?: Express.Multer.File,
) => {
  if (leftClub) {
    const leftClubUrl = await fileUploader.uploadToCloudinary(leftClub);
    payload.leftClub = leftClubUrl.url;
  }
  if (leftCountery) {
    const leftCounteryUrl = await fileUploader.uploadToCloudinary(leftCountery);
    payload.leftCountery = leftCounteryUrl.url;
  }

  if (joinedClub) {
    const joinedClubUrl = await fileUploader.uploadToCloudinary(joinedClub);
    payload.joinedClub = joinedClubUrl.url;
  }

  if (joinedCountery) {
    const joinedCounteryUrl =
      await fileUploader.uploadToCloudinary(joinedCountery);
    payload.joinedCountery = joinedCounteryUrl.url;
  }

  const result = await TransferHistory.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};

const deleteTransferhistory = async (id: string) => {
  const result = await TransferHistory.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'TransferHistory not found');
  }

  return result;
};
export const transferhistoryService = {
  createTransferhistory,
  getAllTransferhistory,
  getSingleTransferhistory,
  updateTransferhistory,
  deleteTransferhistory,
};
