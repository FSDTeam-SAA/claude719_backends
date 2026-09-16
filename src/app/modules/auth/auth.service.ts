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

const sendVerificationEmail = async (user: HydratedDocument<IUser>) => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const previousToken = user.emailVerifyToken;
  const previousExpiry = user.emailVerifyExpires;
  // Atomically reserve a send slot so repeated requests cannot flood the inbox.
  const claimed = await User.updateOne(
    {
      _id: user._id,
      emailVerified: false,
      $or: [
        { emailVerifyExpires: { $exists: false } },
        {
          emailVerifyExpires: {
            $lte: new Date(Date.now() + 24 * 60 * 60 * 1000 - 60000),
          },
        },
      ],
    },
    {
      $set: {
        emailVerifyToken: hashedToken,
        emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    },
  );
  if (!claimed.modifiedCount)
    throw new AppError(
      429,
      'Please wait a minute before requesting another verification email.',
    );
  try {
    const verifyUrl = new URL('/api/v1/auth/verify-email', config.backendUrl);
    verifyUrl.searchParams.set('token', token);
    verifyUrl.searchParams.set('email', user.email);
    await sendMailer(
      user.email,
      'Verify your email - Analytic Soccer',
      '<h3>Please confirm your email address</h3><a href="' +
        verifyUrl.toString() +
        '">Verify Email</a><p>This link will expire in 24 hours.</p>',
    );
  } catch (error) {
    await User.updateOne(
      { _id: user._id, emailVerifyToken: hashedToken, emailVerified: false },
      {
        ...(previousToken && previousExpiry
          ? {
              $set: {
                emailVerifyToken: previousToken,
                emailVerifyExpires: previousExpiry,
              },
            }
          : { $unset: { emailVerifyToken: 1, emailVerifyExpires: 1 } }),
      },
    );
    throw error;
  }
};

const resendVerificationEmail = async (email: string, password: string) => {
  if (typeof email !== 'string' || typeof password !== 'string' || !password)
    throw new AppError(400, 'Email and password are required');
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new AppError(401, 'Email or password is incorrect');
  if (user.emailVerified)
    throw new AppError(400, 'Email is already verified. Please sign in.');
  await sendVerificationEmail(user);
};

const registerUser = async (payload: Partial<IUser>) => {
  if (typeof payload.email !== 'string')
    throw new AppError(400, 'Email is required');
  payload.email = payload.email.trim().toLowerCase();
  const exist = await User.findOne({ email: payload.email });
  if (exist)
    throw new AppError(
      409,
      'Account already exists. Sign in or resend the verification email from the login page.',
    );
  const user = await User.create({
    ...payload,
    provider: 'credentials',
    emailVerified: false,
  });
  await sendVerificationEmail(user);
  return { _id: user._id, email: user.email };
};

// const verifyEmailByToken = async (token: string) => {
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//   const user = await User.findOne({
//     emailVerifyToken: hashedToken,
//     emailVerifyExpires: { $gt: new Date() },
//   });

//   if (!user) {
//     throw new AppError(
//       400,
//       'Invalid or expired verification link .Please again register',
//     );
//   }

//   user.emailVerified = true;
//   user.emailVerifyToken = undefined;
//   user.emailVerifyExpires = undefined;

//   await user.save();

//   return { message: 'Email verified successfully' };
// };

//==================================

const verifyEmailByToken = async (token: string, email: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  let user = await User.findOne({ emailVerifyToken: hashedToken, email });

  if (!user) {
    // token not found, check email
    user = await User.findOne({ email });
    if (user && user.emailVerified) return { status: 'already_verified' };
    throw { statusCode: 400, message: 'Invalid verification link' };
  }

  if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
    throw { statusCode: 410, message: 'Verification link expired' };
  }

  user.emailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  return { status: 'verified' };
};

// const sendVerificationEmail = async (user: HydratedDocument<IUser>) => {
//   const token = crypto.randomBytes(32).toString('hex');
//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//   user.emailVerifyToken = hashedToken;
//   user.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
//   await user.save();
//   const verifyUrl = `${config.backendUrl}/api/v1/auth/verify-email?token=${token}`;
//   await sendMailer(
//     user.email,
//     user.firstName,
//     `
//       <h3>Verify your email</h3>
//       <a href="${verifyUrl}"
//         style="padding:10px 18px;background:#22c55e;color:#fff;text-decoration:none">
//         Verify Email
//       </a>
//       <p>This link will expire in 24 hours</p>
//     `,
//   );
// };

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

      const validRoles = ['player', 'admin', 'gk', 'coach', 'guest'] as const;
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
        emailVerified: true,
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
  resendVerificationEmail,
};
