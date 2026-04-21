// Remove the path normalize import as it's not needed for mathematical operations
import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import Attackingstat from '../attackingstat/attackingstat.model';
import Defensive from '../defensive/defensive.model';
import Distributionstats from '../distributionstats/distributionstats.model';
import Fouls from '../fouls/fouls.model';
import GkDistributionStats from '../gkdistributionstats/gkdistributionstats.model';
import Gkstats from '../gkstats/gkstats.model';
import Marketvalue from '../marketvalue/marketvalue.model';
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
    'nationality',
    'position',
    'category',
    'jerseyNumber',
  ];

  andCondition.push({
    role: { $in: ['player', 'gk','guest'] },
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
  const averageRatingData = await ratingService.getAverageRatingByUser(id);
  const semelierPlayer = await similerPlayersAndGK(id);

  return {
    user,
    rating: await Rating.find(matchField),
    gkstats: await Gkstats.find(matchField),
    attacking: await Attackingstat.find(matchField),
    fouls: await Fouls.find(matchField),
    defensive: await Defensive.find(matchField),
    distribution: await Distributionstats.find(matchField),
    setpieces: await Setpieces.find(matchField),
    national: await National.find(matchField),
    reports: await PlayerReport.find(matchField),
    transferHistory: await TransferHistory.find(matchField),
    gkDistributionStats: await GkDistributionStats.find(matchField),
    avarageRatting: averageRatingData,
    marketValue: await Marketvalue.find(matchField),
    semelierPlayer,
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
    const uploadProfile = await fileUploader.uploadToS3(file);
    if (!uploadProfile?.url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.url;
  }
  if (videos) {
    if (videos && videos.length > 0) {
      const videoUpload = await Promise.all(
        videos.map(async (video) => {
          const uploadVideo = await fileUploader.uploadToS3(video);
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
  const averageRatingData = await ratingService.getAverageRatingByUser(id);
  const semelierPlayer = await similerPlayersAndGK(id);
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
    attackingstat,
    marketValue,
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
    Attackingstat.find(matchField),
    Marketvalue.find(matchField),
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
      attackingstat,
      marketValue,
    },
    reports,
    transferHistory,
    avararageRatting: averageRatingData,
    semelierPlayer,
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
    const uploadProfile = await fileUploader.uploadToS3(file);
    if (!uploadProfile?.url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.url;
  }
  if (videos && videos.length > 0) {
    const videoUpload = await Promise.all(
      videos.map(async (video) => {
        const uploadVideo = await fileUploader.uploadToS3(video);
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
        const uploadVideo = await fileUploader.uploadToS3(video);
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

const followUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new AppError(404, 'Target user not found');

  if (user._id === targetUser._id) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // target user update (followers)
  await User.findByIdAndUpdate(targetUserId, {
    $addToSet: { followers: userId },
  });

  // current user update (following)
  await User.findByIdAndUpdate(userId, {
    $addToSet: { following: targetUserId },
  });

  return { message: 'User followed successfully' };
};

const unfollowUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new AppError(404, 'Target user not found');

  await User.findByIdAndUpdate(targetUserId, {
    $pull: { followers: userId },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { following: targetUserId },
  });

  return { message: 'User unfollowed successfully' };
};

//================================================================================final code ================================
const similerPlayersAndGK = async (userId: string) => {
  const baseUser = await User.findById(userId);
  if (!baseUser) return [];

  const candidates = await User.find({ _id: { $ne: userId } });

  const result: any[] = [];

  for (const user of candidates) {
    const candIsGK = user.role === 'gk';
    const match = candIsGK ? { gk: user._id } : { player: user._id };

    /* ===== 1. AGE — exact match ===== */
    const ageMatch =
      baseUser.age != null &&
      user.age != null &&
      baseUser.age === user.age;

    /* ===== 2. POSITION — যেকোনো একটা মিললেই match ===== */
    const basePos: string[] = baseUser.position ?? [];
    const candPos: string[] = user.position ?? [];
    const positionMatch =
      basePos.length > 0 &&
      candPos.length > 0 &&
      basePos.some((p) => candPos.includes(p));

    /* ===== 3. NATIONALITY — exact match ===== */
    const nationalityMatch =
      !!baseUser.nationality &&
      !!user.nationality &&
      baseUser.nationality.toLowerCase() === user.nationality.toLowerCase();

    /* ===== TOTAL ===== */
    const matchCount = [ageMatch, positionMatch, nationalityMatch].filter(Boolean).length;

    if (matchCount === 0) continue;

    const similarity = Math.round((matchCount / 3) * 100); // 1→33, 2→67, 3→100

    const stats = candIsGK
      ? await Gkstats.findOne(match)
      : await Attackingstat.findOne(match);

    const national = await National.findOne(match);
    const transfer = await TransferHistory.findOne(match).sort({ createdAt: -1 });

    result.push({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage,
      age: user.age,
      nationality: user.nationality || null,
      position: user.position,
      teamName: user.teamName,
      role: user.role,
      similarity,

      ...(user.role === 'player' && stats && {
        goals: (stats as any).goals,
        assists: (stats as any).assists,
      }),
      ...(user.role === 'gk' && stats && {
        saves: (stats as any).saves,
        goalsConceded: (stats as any).goalsConceded,
      }),

      nationalTeam: national
        ? {
            teamName: national.teamName,
            match: national.match,
            goals: national.goals,
            flag: national.flag,
          }
        : null,

      lastTransfer: transfer
        ? {
            season: transfer.season,
            leftClub: transfer.leftClubName,
            joinedClub: transfer.joinedclubName,
            joinedClubCountery: transfer.joinedCountery,
          }
        : null,
    });
  }

  return result.sort((a, b) => b.similarity - a.similarity).slice(0, 6);
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
  followUser,
  unfollowUser,
};
