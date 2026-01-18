import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import Defensive from '../defensive/defensive.model';
import Distributionstats from '../distributionstats/distributionstats.model';
import Fouls from '../fouls/fouls.model';
import GkDistributionStats from '../gkdistributionstats/gkdistributionstats.model';
import Gkstats from '../gkstats/gkstats.model';
import National from '../national/national.model';
import PlayerReport from '../playerreport/playerreport.model';
import Rating from '../rating/rating.model';
import { ratingService } from '../rating/rating.service';
import Setpieces from '../setpieces/setpieces.model';
import TransferHistory from '../transferhistory/transferhistory.model';
import { userRole } from './user.constant';

import { IUser } from './user.interface';
import User from './user.model';

const createUser = async (payload: IUser) => {
  const result = await User.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create user');
  }
  return result;
};

const getAllUser = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'firstName',
    'lastName',
    'email',
    'role',
    'citizenship',
    'position',
    'category',
    'jerseyNumber',
  ];

  andCondition.push({
    role: { $in: ['player', 'gk'] },
  });

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await User.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Users not found');
  }

  const total = await User.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getUserById = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

const getSingleUserDetails = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const matchField = user.role === userRole.gk ? { gk: id } : { player: id };
  const avararageRatting = await ratingService.getAverageRatingByUser(id);

  return {
    user,
    rating: await Rating.find(matchField),
    gkstats: await Gkstats.find(matchField),
    fouls: await Fouls.find(matchField),
    defensive: await Defensive.find(matchField),
    distribution: await Distributionstats.find(matchField),
    setpieces: await Setpieces.find(matchField),
    national: await National.find(matchField),
    reports: await PlayerReport.find(matchField),
    transferHistory: await TransferHistory.find(matchField),
    gkDistributionStats: await GkDistributionStats.find(matchField),
    avarageRatting: avararageRatting,
  };
};

const updateUserById = async (
  id: string,
  payload: IUser,
  file?: Express.Multer.File,
  videos?: Express.Multer.File[],
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  if (file) {
    const uploadProfile = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfile?.url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.url;
  }
  if (videos) {
    if (videos && videos.length > 0) {
      const videoUpload = await Promise.all(
        videos.map(async (video) => {
          const uploadVideo = await fileUploader.uploadToCloudinary(video);
          if (!uploadVideo?.url) {
            throw new AppError(400, 'Failed to upload video');
          }
          return uploadVideo.url;
        }),
      );
      payload.playingVideo = videoUpload;
    }
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

const deleteUserById = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

const profile = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const matchField = user.role === userRole.gk ? { gk: id } : { player: id };
  const avararageRatting = await ratingService.getAverageRatingByUser(id);
  const [
    rating,
    gkstats,
    fouls,
    defensive,
    distribution,
    setpieces,
    national,
    reports,
    transferHistory,
    gkDistributionStats,
  ] = await Promise.all([
    Rating.find(matchField),
    Gkstats.find(matchField),
    Fouls.find(matchField),
    Defensive.find(matchField),
    Distributionstats.find(matchField),
    Setpieces.find(matchField),
    National.find(matchField),
    PlayerReport.find(matchField),
    TransferHistory.find(matchField),
    GkDistributionStats.find(matchField),
  ]);

  return {
    user,
    stats: {
      rating,
      gkstats,
      fouls,
      defensive,
      distribution,
      setpieces,
      national,
      gkDistributionStats,
    },
    reports,
    transferHistory,
    avararageRatting,
  };
};

const updateMyProfile = async (
  id: string,
  payload: IUser,
  file?: Express.Multer.File,
  videos?: Express.Multer.File[],
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // if (user.role !== userRole.admin && !user.isSubscription) {
  //   throw new AppError(403, 'Please subscribe to access this feature');
  // }
  if (file) {
    const uploadProfile = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfile?.url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.url;
  }
  if (videos && videos.length > 0) {
    const videoUpload = await Promise.all(
      videos.map(async (video) => {
        const uploadVideo = await fileUploader.uploadToCloudinary(video);
        if (!uploadVideo?.url) {
          throw new AppError(400, 'Failed to upload video');
        }
        return uploadVideo.url;
      }),
    );
    payload.playingVideo = videoUpload;
  }
  if (user.role !== userRole.admin && payload.inSchoolOrCollege === true) {
    if (!payload.institute || !payload.gpa) {
      throw new AppError(400, 'Institute and GPA are required');
    }
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

const videoAdd = async (id: string, videos: Express.Multer.File[]) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'User not found');
  if (videos && videos.length > 0) {
    const videoUpload = await Promise.all(
      videos.map(async (video) => {
        const uploadVideo = await fileUploader.uploadToCloudinary(video);
        if (!uploadVideo?.url) {
          throw new AppError(400, 'Failed to upload video');
        }
        return uploadVideo.url;
      }),
    );
    user?.playingVideo?.push(...videoUpload);
    const result = await user.save();
    if (!result) throw new AppError(400, 'Failed to add video');
    return result;
  }
};

const removedVideo = async (id: string, videoUrls: string[]) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'User not found');
  user.playingVideo = (user.playingVideo || []).filter(
    (url) => !videoUrls.includes(url),
  );
  const result = await user.save();
  if (!result) throw new AppError(400, 'Failed to remove video');
  return result;
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  profile,
  updateMyProfile,
  videoAdd,
  removedVideo,
  getSingleUserDetails,
};
