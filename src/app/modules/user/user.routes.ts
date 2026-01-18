import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';

import { userRole } from './user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

router.post('/create-user', auth(userRole.admin), userController.createUser);

router.get(
  '/profile',
  auth(userRole.admin, userRole.player, userRole.gk),
  userController.profile,
);
router.put(
  '/profile',
  auth(userRole.admin, userRole.player, userRole.gk),
  fileUploader.upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'playingVideo', maxCount: 5 },
  ]),
  userController.updateMyProfile,
);

router.put(
  '/video-add',
  auth(userRole.admin, userRole.player, userRole.gk),
  fileUploader.upload.array('playingVideo', 5),
  userController.videoAdd,
);
router.delete(
  '/video-remove',
  auth(userRole.admin, userRole.player, userRole.gk),
  userController.removedVideo,
);

router.get('/all-user', userController.getAllUser);
router.get(
  '/detail/:id',
  // auth(userRole.admin),
  userController.getSingleUserDetails,
);
router.put(
  '/follow/:targetUserId',
  auth(
    userRole.coach,
    userRole.gk,
    userRole.player,
    userRole.admin,
    userRole.user,
  ),
  userController.followUser,
);
router.delete(
  '/unfollow/:targetUserId',
  auth(
    userRole.coach,
    userRole.gk,
    userRole.player,
    userRole.admin,
    userRole.user,
  ),
  userController.unfollowUser,
);
router.get('/:id', userController.getUserById);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'playingVideo', maxCount: 5 },
  ]),
  userController.updateUserById,
);
router.delete('/:id', auth(userRole.admin), userController.deleteUserById);

export const userRoutes = router;
