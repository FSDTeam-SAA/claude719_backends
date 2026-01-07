import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IRating } from './rating.interface';
import Rating from './rating.model';

const createRating = async (userId: string, payload: IRating) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  if (user.role === userRole.player) {
    const result = await Rating.create({
      ...payload,
      player: user._id,
    });
    return result;
  }
  if (user.role === userRole.gk) {
    const result = await Rating.create({
      ...payload,
      gk: user._id,
    });

    if (user.isSubscription) {
      if (user.numberOfGame > 0) {
        user.numberOfGame = user.numberOfGame - 1;
        await user.save();
      } else {
        throw new AppError(400, 'You have no game left');
      }
    }
    return result;
  }
};

const getAllRating = async (userId: string, options: IOption) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const andCondition: any[] = [];

  if (user.role === userRole.player) {
    andCondition.push({ player: user._id });
  }

  if (user.role === userRole.gk) {
    andCondition.push({ gk: user._id });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Rating.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate('player', '-password')
    .populate('gk', '-password');

  const total = await Rating.countDocuments(whereCondition);
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleRating = async (id: string) => {
  const result = await Rating.findById(id)
    .populate('player', '-password')
    .populate('gk', '-password');
  if (!result) throw new AppError(404, 'Rating not found');
  return result;
};

const updateRating = async (id: string, payload: IRating) => {
  const result = await Rating.findByIdAndUpdate(id, payload, { new: true })
    .populate('player', '-password')
    .populate('gk', '-password');
  if (!result) throw new AppError(404, 'Rating not found');

  if (result) {
    const user = await User.findById(result.gk || result.player);
    if (user) {
      if (user.isSubscription) {
        if (user.numberOfGame > 0) {
          user.numberOfGame = user.numberOfGame - 1;
          await user.save();
        } else {
          throw new AppError(400, 'You have no game left');
        }
      }
    }
  }
  return result;
};
const deleteRating = async (id: string) => {
  const result = await Rating.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Rating not found');
  return result;
};

export const ratingService = {
  createRating,
  getAllRating,
  getSingleRating,
  updateRating,
  deleteRating,
};
