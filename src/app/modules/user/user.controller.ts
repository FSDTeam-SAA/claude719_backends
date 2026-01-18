import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import pick from '../../helper/pick';
import { userService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'role',
    'citizenship',
    'position',
    'category',
    'jerseyNumber',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await userService.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('User ID is required');
  }
  const result = await userService.getUserById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getSingleUserDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('User ID is required');
  }
  const result = await userService.getSingleUserDetails(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const files = req.files as {
    profileImage?: Express.Multer.File[];
    playingVideo?: Express.Multer.File[];
  };
  const profileImageFile = files?.profileImage?.[0];
  const videoFiles = files?.playingVideo;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await userService.updateUserById(
    req.user.id,
    fromData,
    profileImageFile,
    videoFiles,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('User ID is required');
  }
  const result = await userService.deleteUserById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const profile = catchAsync(async (req, res) => {
  const result = await userService.profile(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const files = req.files as {
    profileImage?: Express.Multer.File[];
    playingVideo?: Express.Multer.File[];
  };
  const profileImageFile = files?.profileImage?.[0];
  const videoFiles = files?.playingVideo;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await userService.updateMyProfile(
    req.user.id,
    fromData,
    profileImageFile,
    videoFiles,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const videoAdd = catchAsync(async (req, res) => {
  const videoFiles = req.files as Express.Multer.File[];
  console.log(req.user.id);
  const result = await userService.videoAdd(req.user.id, videoFiles);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Videos added successfully',
    data: result,
  });
});

const removedVideo = catchAsync(async (req, res) => {
  const { playingVideo } = req.body;
  const result = await userService.removedVideo(req.user.id, playingVideo);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Videos removed successfully',
    data: result,
  });
});

const followUser = catchAsync(async (req, res) => {
  const { targetUserId } = req.params;
  const result = await userService.followUser(req.user.id, targetUserId!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User followed successfully',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const { targetUserId } = req.params;
  const result = await userService.unfollowUser(req.user.id, targetUserId!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User unfollowed successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getUserById,
  getSingleUserDetails,
  updateUserById,
  deleteUserById,
  profile,
  updateMyProfile,
  videoAdd,
  removedVideo,
  followUser,
  unfollowUser,
};
