/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/appError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { jwtHelpers } from '../../helper/jwtHelpers';
import sendMailer from '../../helper/sendMailer';
import bcrypt from 'bcryptjs';
import createOtpTemplate from '../../utils/createOtpTemplate';
import crypto from 'crypto';
import { HydratedDocument } from 'mongoose';

// const registerUser = async (payload: Partial<IUser>) => {
//   const exist = await User.findOne({ email: payload.email });
//   if (exist) throw new AppError(400, 'User already exists');

//   // const idx = Math.floor(Math.random() * 100);
//   // payload.profileImage = `https://avatar.iran.liara.run/public/${idx}.png`;

//   payload.provider = 'credentials';
//   const user = await User.create(payload);

//   return user;
// };

const registerUser = async (payload: Partial<IUser>) => {
  const exist = await User.findOne({ email: payload.email });
  if (exist) throw new AppError(400, 'User already exists');
  payload.provider = 'credentials';
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.create({
    ...payload,
    emailVerifyToken: hashedToken,
    emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  const verifyUrl = `${config.backendUrl}/api/v1/auth/verify-email?token=${token}`;

  await sendMailer(
    user.email,
    user.firstName,
    `
    <h3>Verify your email</h3>
    <a href="${verifyUrl}"
       style="padding:10px 18px;background:#22c55e;color:#fff;text-decoration:none">
       Verify Email
    </a>
    <p>This link will expire in 24 hours</p>
    `,
  );

  return user;
};

const verifyEmailByToken = async (token: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(
      400,
      'Invalid or expired verification link .Please again register',
    );
  }

  user.emailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;

  await user.save();

  return { message: 'Email verified successfully' };
};

// const verifyEmailByToken = async (token: string) => {
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//   // Token অনুযায়ী user খুঁজে নেওয়া
//   const user = await User.findOne({ emailVerifyToken: hashedToken });

//   if (!user) {
//     // যদি এমন কোনো token না থাকে
//     throw new AppError(
//       400,
//       'Invalid verification link. Please register again.'
//     );
//   }

//   // যদি token expired হয়ে যায়
//   if (user.emailVerifyExpires! < new Date()) {
//     // শুধু expired token ইউজার delete করা হবে
//     await User.deleteOne({ _id: user._id });
//     throw new AppError(
//       400,
//       'Verification link expired. Your registration has been removed. Please register again.'
//     );
//   }

//   // যদি user already verified হয়
//   if (user.emailVerified) {
//     throw new AppError(400, 'User already verified.');
//   }

//   // Email ভেরিফাই করা
//   user.emailVerified = true;
//   user.emailVerifyToken = undefined;
//   user.emailVerifyExpires = undefined;

//   await user.save();

//   return { message: 'Email verified successfully' };
// };

const sendVerificationEmail = async (user: HydratedDocument<IUser>) => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  user.emailVerifyToken = hashedToken;
  user.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();
  const verifyUrl = `${config.backendUrl}/api/v1/auth/verify-email?token=${token}`;
  await sendMailer(
    user.email,
    user.firstName,
    `
      <h3>Verify your email</h3>
      <a href="${verifyUrl}"
        style="padding:10px 18px;background:#22c55e;color:#fff;text-decoration:none">
        Verify Email
      </a>
      <p>This link will expire in 24 hours</p>
    `,
  );
};

const loginUser = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new AppError(401, 'User not found');
  if (!payload.password) throw new AppError(400, 'Password is required');
  if (!user.emailVerified)
    throw new AppError(403, 'Please verify your email first');

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) throw new AppError(401, 'Password not matched');

  const accessToken = jwtHelpers.genaretToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );

  const refreshToken = jwtHelpers.genaretToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshTokenExpires,
  );

  user.lastLogin = new Date();
  await user.save();

  const { password, ...userWithoutPassword } = user.toObject();
  return { accessToken, refreshToken, user: userWithoutPassword };
};

const googleLogin = async (idToken: string, role?: string) => {
  try {
    console.log('=== GOOGLE LOGIN BACKEND START ===');

    const payload = await jwtHelpers.verifyGoogleToken(idToken);

    const email = payload.email!;
    const firstName = payload.given_name || payload.name || 'Google User';
    const lastName = payload.family_name || '';
    const profileImage = payload.picture;
    let user = await User.findOne({ email });
    if (!user) {
      console.log('🆕 New Google user detected');

      const validRoles = ['player', 'admin', 'gk'] as const;
      const userRole =
        role && validRoles.includes(role as any) ? role : 'player';

      user = await User.create({
        firstName,
        lastName,
        email,
        password: 'GOOGLE_AUTH_' + Math.random().toString(36).slice(2),
        role: userRole,
        provider: 'google',
        verified: true,
        profileImage,
      });

      console.log('✅ User created with role:', user.role);
    } else {
      console.log('👤 Existing user login');
      console.log('🔒 Role locked as:', user.role);
    }
    const accessToken = jwtHelpers.genaretToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt.accessTokenSecret as Secret,
      config.jwt.accessTokenExpires,
    );

    const refreshToken = jwtHelpers.genaretToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt.refreshTokenSecret as Secret,
      config.jwt.refreshTokenExpires,
    );
    user.lastLogin = new Date();
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

const refreshToken = async (token: string) => {
  const varifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.refreshTokenSecret as Secret,
  ) as JwtPayload;

  const user = await User.findById(varifiedToken.id);
  if (!user) throw new AppError(401, 'User not found');

  const accessToken = jwtHelpers.genaretToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );

  const { password, ...userWithoutPassword } = user.toObject();
  return { accessToken, user: userWithoutPassword };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await user.save();

  await sendMailer(
    user.email,
    user.firstName + ' ' + user.lastName,
    createOtpTemplate(otp, user.email, 'Your Company'),
  );

  return { message: 'OTP sent to your email' };
};

const verifyEmail = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'User not found');

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  user.verified = true;
  (user as any).otp = undefined;
  (user as any).otpExpiry = undefined;
  await user.save();

  return { message: 'Email verified successfully' };
};

const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, 'User not found');

  user.password = newPassword;
  (user as any).otp = undefined;
  (user as any).otpExpiry = undefined;
  await user.save();

  // Auto-login after reset
  const accessToken = jwtHelpers.genaretToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );
  const refreshToken = jwtHelpers.genaretToken(
    { id: user._id, role: user.role, email: user.email },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshTokenExpires,
  );

  const { password, ...userWithoutPassword } = user.toObject();
  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) throw new AppError(400, 'Password not matched');

  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  verifyEmail,
  resetPassword,
  changePassword,
  googleLogin,
  verifyEmailByToken,
  sendVerificationEmail,
};
