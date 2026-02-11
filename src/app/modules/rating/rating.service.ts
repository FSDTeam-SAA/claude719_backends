import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IRating } from './rating.interface';
import Rating from './rating.model';

const createRating = async (userId: string, payload: IRating) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  // subscription check
  if (user.isSubscription && user.team) {
    if (user.numberOfGame > 0) {
      user.numberOfGame -= 1;
      await user.save();
    } else {
      user.isSubscription = false;
      await user.save();
      throw new AppError(400, 'You have no game left');
    }
  }

  let filter: any = {};
  let owner: any = {};

  if (user.role === userRole.player) {
    filter.player = user._id;
    owner.player = user._id;
  } else if (user.role === userRole.gk) {
    filter.gk = user._id;
    owner.gk = user._id;
  } else {
    throw new AppError(400, 'Invalid role');
  }

  const lastRating = await Rating.findOne(filter).sort({ createdAt: -1 });

  const previousGames = lastRating?.gamesNumber || 0;

  const newRating = await Rating.create({
    ...payload,
    ...owner,
    gamesNumber: previousGames + 1,
  });

  return newRating;
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

  return result;
};
const deleteRating = async (id: string) => {
  const result = await Rating.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'Rating not found');
  return result;
};

// const calculateStars = (rating: number): number => {
//   if (rating >= 8.8) return 5;
//   if (rating >= 8) return 4;
//   if (rating >= 5) return 3;
//   if (rating >= 3) return 2;
//   if (rating > 0) return 1;
//   return 0;
// };

// const getAverageRatingByUser = async (userId: string) => {
//   const ratings = await Rating.find({
//     $or: [{ player: userId }, { gk: userId }],
//   });

//   if (!ratings.length) {
//     return {
//       averageRating: 0,
//       gamesNumber: 0,
//       stars: 0,
//     };
//   }

//   const totalRating = ratings.reduce(
//     (sum, item) => sum + (item.rating || 0),
//     0,
//   );

//   const totalGames = ratings.reduce(
//     (sum, item) => sum + (item.gamesNumber || 0),
//     0,
//   );

//   const averageRating = totalGames > 0 ? totalRating / totalGames : 0;

//   const stars = calculateStars(averageRating);

//   return {
//     averageRating: Number(averageRating.toFixed(1)),
//     gamesNumber: totalGames,
//     stars,
//   };
// };


const calculateStars = (rating: number): number => {
  if (rating >= 8.8) return 5;
  if (rating >= 8) return 4;
  if (rating >= 5) return 3;
  if (rating >= 3) return 2;
  if (rating > 0) return 1;
  return 0;
};

const getAverageRatingByUser = async (userId: string) => {
  // console.log(userId);
  const ratings = await Rating.find({
    $or: [{ player: userId }, { gk: userId }],
  });

  // no rating
  if (!ratings.length) {
    return {
      averageRating: 0,
      gamesNumber: 0,
      stars: 0,
    };
  }

  // sum of all ratings
  const totalRating = ratings.reduce(
    (sum, item) => sum + (item.rating || 0),
    0,
  );

  // total number of ratings
  const totalRatingsCount = ratings.length;

  // FIXED average calculation
  const averageRating = totalRating / totalRatingsCount;

  // stars logic unchanged
  const stars = calculateStars(averageRating);

  return {
    averageRating: Number(averageRating.toFixed(1)),
    gamesNumber: totalRatingsCount, // same field name kept
    stars,
  };
};


export const ratingService = {
  createRating,
  getAllRating,
  getSingleRating,
  updateRating,
  deleteRating,
  getAverageRatingByUser,
};
