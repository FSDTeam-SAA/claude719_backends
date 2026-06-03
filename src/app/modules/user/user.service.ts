// // Remove the path normalize import as it's not needed for mathematical operations
// import AppError from '../../error/appError';
// import { fileUploader } from '../../helper/fileUploder';
// import pagination, { IOption } from '../../helper/pagenation';
// import Attackingstat from '../attackingstat/attackingstat.model';
// import Defensive from '../defensive/defensive.model';
// import Distributionstats from '../distributionstats/distributionstats.model';
// import Fouls from '../fouls/fouls.model';
// import GkDistributionStats from '../gkdistributionstats/gkdistributionstats.model';
// import Gkstats from '../gkstats/gkstats.model';
// import Marketvalue from '../marketvalue/marketvalue.model';
// import National from '../national/national.model';
// import PlayerReport from '../playerreport/playerreport.model';
// import Rating from '../rating/rating.model';
// import { ratingService } from '../rating/rating.service';
// import Setpieces from '../setpieces/setpieces.model';
// import TransferHistory from '../transferhistory/transferhistory.model';
// import { userRole } from './user.constant';

// import { IUser } from './user.interface';
// import User from './user.model';

// const createUser = async (payload: IUser) => {
//   const result = await User.create(payload);
//   if (!result) {
//     throw new AppError(400, 'Failed to create user');
//   }
//   return result;
// };

// const getAllUser = async (params: any, options: IOption) => {
//   const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andCondition: any[] = [];
//   const userSearchableFields = [
//     'firstName',
//     'lastName',
//     'email',
//     'role',
//     'citizenship',
//     'nationality',
//     'position',
//     'category',
//     'jerseyNumber',
//   ];

//   andCondition.push({
//     role: { $in: ['player', 'gk'] },
//   });

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

//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

//   const result = await User.find(whereCondition)
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder } as any);

//   if (!result) {
//     throw new AppError(404, 'Users not found');
//   }

//   const total = await User.countDocuments(whereCondition);

//   return {
//     data: result,
//     meta: {
//       total,
//       page,
//       limit,
//     },
//   };
// };
// const getAllGuest = async (params: any, options: IOption) => {
//   const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andCondition: any[] = [];
//   const userSearchableFields = [
//     'firstName',
//     'lastName',
//     'email',
//     'role',
//     'citizenship',
//     'nationality',
//     'position',
//     'category',
//     'jerseyNumber',
//   ];

//   andCondition.push({
//     role: { $in: ['guest'] },
//   });

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

//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

//   const result = await User.find(whereCondition)
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder } as any);

//   if (!result) {
//     throw new AppError(404, 'Users not found');
//   }

//   const total = await User.countDocuments(whereCondition);

//   return {
//     data: result,
//     meta: {
//       total,
//       page,
//       limit,
//     },
//   };
// };

// const getUserById = async (id: string) => {
//   const result = await User.findById(id);
//   if (!result) {
//     throw new AppError(404, 'User not found');
//   }
//   return result;
// };

// const getSingleUserDetails = async (id: string) => {
//   const user = await User.findById(id).select('-password');
//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }

//   const matchField = user.role === userRole.gk ? { gk: id } : { player: id };
//   const averageRatingData = await ratingService.getAverageRatingByUser(id);
//   const semelierPlayer = await similerPlayersAndGK(id);

//   return {
//     user,
//     rating: await Rating.find(matchField),
//     gkstats: await Gkstats.find(matchField),
//     attacking: await Attackingstat.find(matchField),
//     fouls: await Fouls.find(matchField),
//     defensive: await Defensive.find(matchField),
//     distribution: await Distributionstats.find(matchField),
//     setpieces: await Setpieces.find(matchField),
//     national: await National.find(matchField),
//     reports: await PlayerReport.find(matchField),
//     transferHistory: await TransferHistory.find(matchField),
//     gkDistributionStats: await GkDistributionStats.find(matchField),
//     avarageRatting: averageRatingData,
//     marketValue: await Marketvalue.find(matchField),
//     semelierPlayer,
//   };
// };

// const updateUserById = async (
//   id: string,
//   payload: IUser,
//   file?: Express.Multer.File,
//   videos?: Express.Multer.File[],
// ) => {
//   const user = await User.findById(id);
//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }
//   if (file) {
//     const uploadProfile = await fileUploader.uploadToS3(file);
//     if (!uploadProfile?.url) {
//       throw new AppError(400, 'Failed to upload profile image');
//     }
//     payload.profileImage = uploadProfile.url;
//   }
//   if (videos) {
//     if (videos && videos.length > 0) {
//       const videoUpload = await Promise.all(
//         videos.map(async (video) => {
//           const uploadVideo = await fileUploader.uploadToS3(video);
//           if (!uploadVideo?.url) {
//             throw new AppError(400, 'Failed to upload video');
//           }
//           return uploadVideo.url;
//         }),
//       );
//       payload.playingVideo = videoUpload;
//     }
//   }
//   const result = await User.findByIdAndUpdate(id, payload, { new: true });
//   if (!result) {
//     throw new AppError(404, 'User not found');
//   }
//   return result;
// };

// const deleteUserById = async (id: string) => {
//   const result = await User.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError(404, 'User not found');
//   }
//   return result;
// };

// const profile = async (id: string) => {
//   const user = await User.findById(id);
//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }

//   const matchField = user.role === userRole.gk ? { gk: id } : { player: id };
//   const averageRatingData = await ratingService.getAverageRatingByUser(id);
//   const semelierPlayer = await similerPlayersAndGK(id);
//   const [
//     rating,
//     gkstats,
//     fouls,
//     defensive,
//     distribution,
//     setpieces,
//     national,
//     reports,
//     transferHistory,
//     gkDistributionStats,
//     attackingstat,
//     marketValue,
//   ] = await Promise.all([
//     Rating.find(matchField),
//     Gkstats.find(matchField),
//     Fouls.find(matchField),
//     Defensive.find(matchField),
//     Distributionstats.find(matchField),
//     Setpieces.find(matchField),
//     National.find(matchField),
//     PlayerReport.find(matchField),
//     TransferHistory.find(matchField),
//     GkDistributionStats.find(matchField),
//     Attackingstat.find(matchField),
//     Marketvalue.find(matchField),
//   ]);

//   return {
//     user,
//     stats: {
//       rating,
//       gkstats,
//       fouls,
//       defensive,
//       distribution,
//       setpieces,
//       national,
//       gkDistributionStats,
//       attackingstat,
//       marketValue,
//     },
//     reports,
//     transferHistory,
//     avararageRatting: averageRatingData,
//     semelierPlayer,
//   };
// };

// const updateMyProfile = async (
//   id: string,
//   payload: IUser,
//   file?: Express.Multer.File,
//   videos?: Express.Multer.File[],
// ) => {
//   const user = await User.findById(id);
//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }

//   // if (user.role !== userRole.admin && !user.isSubscription) {
//   //   throw new AppError(403, 'Please subscribe to access this feature');
//   // }
//   if (file) {
//     const uploadProfile = await fileUploader.uploadToS3(file);
//     if (!uploadProfile?.url) {
//       throw new AppError(400, 'Failed to upload profile image');
//     }
//     payload.profileImage = uploadProfile.url;
//   }
//   if (videos && videos.length > 0) {
//     const videoUpload = await Promise.all(
//       videos.map(async (video) => {
//         const uploadVideo = await fileUploader.uploadToS3(video);
//         if (!uploadVideo?.url) {
//           throw new AppError(400, 'Failed to upload video');
//         }
//         return uploadVideo.url;
//       }),
//     );
//     payload.playingVideo = videoUpload;
//   }
//   if (user.role !== userRole.admin && payload.inSchoolOrCollege === true) {
//     if (!payload.institute || !payload.gpa) {
//       throw new AppError(400, 'Institute and GPA are required');
//     }
//   }
//   const result = await User.findByIdAndUpdate(id, payload, { new: true });
//   if (!result) {
//     throw new AppError(404, 'User not found');
//   }
//   return result;
// };

// const videoAdd = async (id: string, videos: Express.Multer.File[]) => {
//   const user = await User.findById(id);
//   if (!user) throw new AppError(404, 'User not found');
//   if (videos && videos.length > 0) {
//     const videoUpload = await Promise.all(
//       videos.map(async (video) => {
//         const uploadVideo = await fileUploader.uploadToS3(video);
//         if (!uploadVideo?.url) {
//           throw new AppError(400, 'Failed to upload video');
//         }
//         return uploadVideo.url;
//       }),
//     );
//     user?.playingVideo?.push(...videoUpload);
//     const result = await user.save();
//     if (!result) throw new AppError(400, 'Failed to add video');
//     return result;
//   }
// };

// const removedVideo = async (id: string, videoUrls: string[]) => {
//   const user = await User.findById(id);
//   if (!user) throw new AppError(404, 'User not found');
//   user.playingVideo = (user.playingVideo || []).filter(
//     (url) => !videoUrls.includes(url),
//   );
//   const result = await user.save();
//   if (!result) throw new AppError(400, 'Failed to remove video');
//   return result;
// };

// const followUser = async (userId: string, targetUserId: string) => {
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');
//   const targetUser = await User.findById(targetUserId);
//   if (!targetUser) throw new AppError(404, 'Target user not found');

//   if (user._id === targetUser._id) {
//     throw new AppError(400, 'You cannot follow yourself');
//   }

//   // target user update (followers)
//   await User.findByIdAndUpdate(targetUserId, {
//     $addToSet: { followers: userId },
//   });

//   // current user update (following)
//   await User.findByIdAndUpdate(userId, {
//     $addToSet: { following: targetUserId },
//   });

//   return { message: 'User followed successfully' };
// };

// const unfollowUser = async (userId: string, targetUserId: string) => {
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');
//   const targetUser = await User.findById(targetUserId);
//   if (!targetUser) throw new AppError(404, 'Target user not found');

//   await User.findByIdAndUpdate(targetUserId, {
//     $pull: { followers: userId },
//   });

//   await User.findByIdAndUpdate(userId, {
//     $pull: { following: targetUserId },
//   });

//   return { message: 'User unfollowed successfully' };
// };

// //================================================================================final code ================================
// const similerPlayersAndGK = async (userId: string) => {
//   const baseUser = await User.findById(userId);
//   if (!baseUser) return [];

//   const candidates = await User.find({ _id: { $ne: userId } });

//   const result: any[] = [];

//   for (const user of candidates) {
//     const candIsGK = user.role === 'gk';
//     const match = candIsGK ? { gk: user._id } : { player: user._id };

//     /* ===== 1. AGE — exact match ===== */
//     const ageMatch =
//       baseUser.age != null && user.age != null && baseUser.age === user.age;

//     /* ===== 2. POSITION — যেকোনো একটা মিললেই match ===== */
//     const basePos: string[] = baseUser.position ?? [];
//     const candPos: string[] = user.position ?? [];
//     const positionMatch =
//       basePos.length > 0 &&
//       candPos.length > 0 &&
//       basePos.some((p) => candPos.includes(p));

//     /* ===== 3. NATIONALITY — exact match ===== */
//     const nationalityMatch =
//       !!baseUser.nationality &&
//       !!user.nationality &&
//       baseUser.nationality.toLowerCase() === user.nationality.toLowerCase();

//     /* ===== TOTAL ===== */
//     const matchCount = [ageMatch, positionMatch, nationalityMatch].filter(
//       Boolean,
//     ).length;

//     if (matchCount === 0) continue;

//     const similarity = Math.round((matchCount / 3) * 100); // 1→33, 2→67, 3→100

//     const stats = candIsGK
//       ? await Gkstats.findOne(match)
//       : await Attackingstat.findOne(match);

//     const national = await National.findOne(match);
//     const transfer = await TransferHistory.findOne(match).sort({
//       createdAt: -1,
//     });

//     result.push({
//       _id: user._id,
//       name: `${user.firstName} ${user.lastName}`,
//       profileImage: user.profileImage,
//       age: user.age,
//       nationality: user.nationality || null,
//       position: user.position,
//       teamName: user.teamName,
//       role: user.role,
//       similarity,

//       ...(user.role === 'player' &&
//         stats && {
//           goals: (stats as any).goals,
//           assists: (stats as any).assists,
//         }),
//       ...(user.role === 'gk' &&
//         stats && {
//           saves: (stats as any).saves,
//           goalsConceded: (stats as any).goalsConceded,
//         }),

//       nationalTeam: national
//         ? {
//             teamName: national.teamName,
//             match: national.match,
//             goals: national.goals,
//             flag: national.flag,
//           }
//         : null,

//       lastTransfer: transfer
//         ? {
//             season: transfer.season,
//             leftClub: transfer.leftClubName,
//             joinedClub: transfer.joinedclubName,
//             joinedClubCountery: transfer.joinedCountery,
//           }
//         : null,
//     });
//   }

//   return result.sort((a, b) => b.similarity - a.similarity).slice(0, 6);
// };

// export const userService = {
//   createUser,
//   getAllUser,
//   getUserById,
//   updateUserById,
//   deleteUserById,
//   profile,
//   updateMyProfile,
//   videoAdd,
//   removedVideo,
//   getSingleUserDetails,
//   followUser,
//   unfollowUser,
//   getAllGuest,
// };

//======================================================================== optimised update code =========================================================================
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
const getAllGuest = async (params: any, options: IOption) => {
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
    role: { $in: ['guest'] },
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
  const mongoose = await import('mongoose');
  const objectId = new mongoose.Types.ObjectId(id);

  const [user, ...statsResults] = await Promise.all([
    User.findById(objectId).select('-password').lean(),
    // সব stat query একসাথে — user fetch এর সাথে parallel এ
    Rating.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Gkstats.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Attackingstat.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Fouls.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Defensive.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Distributionstats.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Setpieces.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    National.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    PlayerReport.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    TransferHistory.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    GkDistributionStats.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    Marketvalue.find({ $or: [{ player: objectId }, { gk: objectId }] }).lean(),
    ratingService.getAverageRatingByUser(id),
  ]);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const [
    rating,
    gkstats,
    attacking,
    fouls,
    defensive,
    distribution,
    setpieces,
    national,
    reports,
    transferHistory,
    gkDistributionStats,
    marketValue,
    averageRatingData,
  ] = statsResults;

  return {
    user,
    rating,
    gkstats,
    attacking,
    fouls,
    defensive,
    distribution,
    setpieces,
    national,
    reports,
    transferHistory,
    gkDistributionStats,
    avarageRatting: averageRatingData,
    marketValue,
  };
};

// Similar Players — আলাদা endpoint এর জন্য
const getSimilarPlayers = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return similerPlayersAndGK(id, user);
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
  const mongoose = await import('mongoose');
  const objectId = new mongoose.Types.ObjectId(id);

  const user = await User.findById(objectId).lean();
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const matchField = { $or: [{ player: objectId }, { gk: objectId }] };

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
    averageRatingData,
    semelierPlayer,
  ] = await Promise.all([
    Rating.find(matchField).lean(),
    Gkstats.find(matchField).lean(),
    Fouls.find(matchField).lean(),
    Defensive.find(matchField).lean(),
    Distributionstats.find(matchField).lean(),
    Setpieces.find(matchField).lean(),
    National.find(matchField).lean(),
    PlayerReport.find(matchField).lean(),
    TransferHistory.find(matchField).lean(),
    GkDistributionStats.find(matchField).lean(),
    Attackingstat.find(matchField).lean(),
    Marketvalue.find(matchField).lean(),
    ratingService.getAverageRatingByUser(id),
    similerPlayersAndGK(id, user),
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

  // দুটো update একসাথে parallel এ
  await Promise.all([
    User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: userId } }),
    User.findByIdAndUpdate(userId, { $addToSet: { following: targetUserId } }),
  ]);

  return { message: 'User followed successfully' };
};

const unfollowUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new AppError(404, 'Target user not found');

  await Promise.all([
    User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } }),
    User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } }),
  ]);

  return { message: 'User unfollowed successfully' };
};

//================================================================================final code ================================
const similerPlayersAndGK = async (userId: string, baseUser: any) => {
  if (!baseUser) return [];

  const mongoose = await import('mongoose');
  const baseId = new mongoose.Types.ObjectId(userId);

  const orConditions: any[] = [];
  if (baseUser.age != null) orConditions.push({ age: baseUser.age });
  if ((baseUser.position ?? []).length > 0)
    orConditions.push({ position: { $in: baseUser.position } });
  if (baseUser.nationality)
    orConditions.push({ nationality: baseUser.nationality });

  if (orConditions.length === 0) return [];

  // একটাই aggregation — সব join MongoDB এর ভেতরেই হবে
  const results = await User.aggregate([
    // Step 1: similar candidates filter
    {
      $match: {
        _id: { $ne: baseId },
        $or: orConditions,
      },
    },
    { $limit: 20 },

    // Step 2: similarity score MongoDB তেই calculate করো
    {
      $addFields: {
        similarity: {
          $multiply: [
            {
              $divide: [
                {
                  $add: [
                    { $cond: [{ $eq: ['$age', baseUser.age ?? null] }, 1, 0] },
                    {
                      $cond: [
                        {
                          $gt: [
                            {
                              $size: {
                                $ifNull: [
                                  {
                                    $setIntersection: [
                                      '$position',
                                      baseUser.position ?? [],
                                    ],
                                  },
                                  [],
                                ],
                              },
                            },
                            0,
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                    {
                      $cond: [
                        { $eq: ['$nationality', baseUser.nationality ?? null] },
                        1,
                        0,
                      ],
                    },
                  ],
                },
                3,
              ],
            },
            100,
          ],
        },
      },
    },
    { $match: { similarity: { $gt: 0 } } },
    { $sort: { similarity: -1 } },
    { $limit: 6 },

    // Step 3: GK stats join
    {
      $lookup: {
        from: 'gkstats',
        let: { uid: '$_id', role: '$role' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$$role', 'gk'] },
                  { $eq: ['$gk', '$$uid'] },
                ],
              },
            },
          },
          { $limit: 1 },
          { $project: { saves: 1, goalsConceded: 1 } },
        ],
        as: 'gkStats',
      },
    },

    // Step 4: Player (attacking) stats join
    {
      $lookup: {
        from: 'attackingstats',
        let: { uid: '$_id', role: '$role' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$$role', 'gk'] },
                  { $eq: ['$player', '$$uid'] },
                ],
              },
            },
          },
          { $limit: 1 },
          { $project: { goals: 1, assists: 1 } },
        ],
        as: 'playerStats',
      },
    },

    // Step 5: National team join
    {
      $lookup: {
        from: 'nationals',
        let: { uid: '$_id', role: '$role' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$gk', '$$uid'] },
                  { $eq: ['$player', '$$uid'] },
                ],
              },
            },
          },
          { $limit: 1 },
          { $project: { teamName: 1, match: 1, goals: 1, flag: 1 } },
        ],
        as: 'nationalData',
      },
    },

    // Step 6: Transfer history join
    {
      $lookup: {
        from: 'transferhistories',
        let: { uid: '$_id', role: '$role' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$gk', '$$uid'] },
                  { $eq: ['$player', '$$uid'] },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $project: {
              season: 1,
              leftClubName: 1,
              joinedclubName: 1,
              joinedCountery: 1,
            },
          },
        ],
        as: 'transferData',
      },
    },

    // Step 7: final shape
    {
      $project: {
        _id: 1,
        name: { $concat: ['$firstName', ' ', '$lastName'] },
        profileImage: 1,
        age: 1,
        nationality: 1,
        position: 1,
        teamName: 1,
        role: 1,
        similarity: { $round: ['$similarity', 0] },
        saves: { $arrayElemAt: ['$gkStats.saves', 0] },
        goalsConceded: { $arrayElemAt: ['$gkStats.goalsConceded', 0] },
        goals: { $arrayElemAt: ['$playerStats.goals', 0] },
        assists: { $arrayElemAt: ['$playerStats.assists', 0] },
        nationalTeam: { $arrayElemAt: ['$nationalData', 0] },
        lastTransfer: { $arrayElemAt: ['$transferData', 0] },
      },
    },
  ]);

  return results;
};



//================================================================================final code ================================
// const similerPlayersAndGK = async (userId: string, baseUser: any) => {
//   if (!baseUser) return [];

//   const mongoose = await import('mongoose');
//   const baseId = new mongoose.Types.ObjectId(userId);

//   const orConditions: any[] = [];
//   if (baseUser.age != null) orConditions.push({ age: baseUser.age });
//   if ((baseUser.position ?? []).length > 0)
//     orConditions.push({ position: { $in: baseUser.position } });
//   if (baseUser.nationality)
//     orConditions.push({ nationality: baseUser.nationality });

//   if (orConditions.length === 0) return [];

//   // একটাই aggregation — সব join MongoDB এর ভেতরেই হবে
//   const results = await User.aggregate([
//     // Step 1: similar candidates filter
//     {
//       $match: {
//         _id: { $ne: baseId },
//         $or: orConditions,
//       },
//     },
//     { $limit: 20 },

//     // Step 2: similarity score MongoDB তেই calculate করো
//     {
//       $addFields: {
//         similarity: {
//           $multiply: [
//             {
//               $divide: [
//                 {
//                   $add: [
//                     { $cond: [{ $eq: ['$age', baseUser.age ?? null] }, 1, 0] },
//                     {
//                       $cond: [
//                         {
//                           $gt: [
//                             {
//                               $size: {
//                                 $ifNull: [
//                                   {
//                                     $setIntersection: [
//                                       '$position',
//                                       baseUser.position ?? [],
//                                     ],
//                                   },
//                                   [],
//                                 ],
//                               },
//                             },
//                             0,
//                           ],
//                         },
//                         1,
//                         0,
//                       ],
//                     },
//                     {
//                       $cond: [
//                         { $eq: ['$nationality', baseUser.nationality ?? null] },
//                         1,
//                         0,
//                       ],
//                     },
//                   ],
//                 },
//                 3,
//               ],
//             },
//             100,
//           ],
//         },
//       },
//     },
//     { $match: { similarity: { $gt: 0 } } },
//     { $sort: { similarity: -1 } },
//     { $limit: 6 },

//     // Step 3: GK stats join
//     {
//       $lookup: {
//         from: 'gkstats',
//         let: { uid: '$_id', role: '$role' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [{ $eq: ['$$role', 'gk'] }, { $eq: ['$gk', '$$uid'] }],
//               },
//             },
//           },
//           { $limit: 1 },
//           { $project: { saves: 1, goalsConceded: 1 } },
//         ],
//         as: 'gkStats',
//       },
//     },

//     // Step 4: Player (attacking) stats join
//     {
//       $lookup: {
//         from: 'attackingstats',
//         let: { uid: '$_id', role: '$role' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $ne: ['$$role', 'gk'] },
//                   { $eq: ['$player', '$$uid'] },
//                 ],
//               },
//             },
//           },
//           { $limit: 1 },
//           { $project: { goals: 1, assists: 1 } },
//         ],
//         as: 'playerStats',
//       },
//     },

//     // Step 5: National team join
//     {
//       $lookup: {
//         from: 'nationals',
//         let: { uid: '$_id', role: '$role' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $or: [{ $eq: ['$gk', '$$uid'] }, { $eq: ['$player', '$$uid'] }],
//               },
//             },
//           },
//           { $limit: 1 },
//           { $project: { teamName: 1, match: 1, goals: 1, flag: 1 } },
//         ],
//         as: 'nationalData',
//       },
//     },

//     // Step 6: Transfer history join
//     {
//       $lookup: {
//         from: 'transferhistories',
//         let: { uid: '$_id', role: '$role' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $or: [{ $eq: ['$gk', '$$uid'] }, { $eq: ['$player', '$$uid'] }],
//               },
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: 1 },
//           {
//             $project: {
//               season: 1,
//               leftClubName: 1,
//               joinedclubName: 1,
//               joinedCountery: 1,
//             },
//           },
//         ],
//         as: 'transferData',
//       },
//     },

//     // Step 7: final shape
//     {
//       $project: {
//         _id: 1,
//         name: { $concat: ['$firstName', ' ', '$lastName'] },
//         profileImage: 1,
//         age: 1,
//         nationality: 1,
//         position: 1,
//         teamName: 1,
//         role: 1,
//         similarity: { $round: ['$similarity', 0] },
//         saves: { $arrayElemAt: ['$gkStats.saves', 0] },
//         goalsConceded: { $arrayElemAt: ['$gkStats.goalsConceded', 0] },
//         goals: { $arrayElemAt: ['$playerStats.goals', 0] },
//         assists: { $arrayElemAt: ['$playerStats.assists', 0] },
//         nationalTeam: { $arrayElemAt: ['$nationalData', 0] },
//         lastTransfer: { $arrayElemAt: ['$transferData', 0] },
//       },
//     },
//   ]);

//   return results;
// };

export const userService = {
  getSimilarPlayers,
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
  getAllGuest,
};
