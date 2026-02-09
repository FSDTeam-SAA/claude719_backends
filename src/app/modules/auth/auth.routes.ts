import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';

const router = express.Router();

router.post('/register', authController.registerUser);
router.get('/verify-email', authController.verifyEmailByToken);
// router.post('/resend-verification', authController.resendVerificationEmail);

router.post('/login', authController.loginUser);
router.post('/google-login', authController.googleLogin);

router.get('/check-user', authController.checkUserExists);

router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logoutUser);
router.post(
  '/change-password',
  auth(userRole.admin, userRole.player),
  authController.changePassword,
);

export const authRoutes = router;
