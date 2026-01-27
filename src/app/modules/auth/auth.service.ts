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

const registerUser = async (payload: Partial<IUser>) => {
  const exist = await User.findOne({ email: payload.email });
  if (exist) throw new AppError(400, 'User already exists');

  // const idx = Math.floor(Math.random() * 100);
  // payload.profileImage = `https://avatar.iran.liara.run/public/${idx}.png`;

  payload.provider = 'credentials';
  const user = await User.create(payload);

  return user;
};

const loginUser = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new AppError(401, 'User not found');
  if (!payload.password) throw new AppError(400, 'Password is required');

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) throw new AppError(401, 'Password not matched');
  // if (!user.verified) throw new AppError(403, 'Please verify your email first');

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
    console.log("=== GOOGLE LOGIN BACKEND START ===");
    console.log("Received role parameter:", role);
    
    const payload = await jwtHelpers.verifyGoogleToken(idToken);

    const email = payload.email!;
    const firstName = payload.given_name || payload.name || 'Google User';
    const lastName = payload.family_name || '';
    const profileImage = payload.picture;

    console.log("User email:", email);

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // ✅ NEW USER - Create with the provided role
      console.log("🔍 User NOT found in database. Creating new user...");
      
      // Use provided role, default to 'player' if not provided
      const validRoles = ['player', 'admin', 'gk'];
      const userRole = (role && validRoles.includes(role) ? role : 'player') as 'player' | 'admin' | 'gk';
      
      console.log("🎯 Creating user with role:", userRole);
      
      user = await User.create({
        firstName,
        lastName,
        email,
        password: 'GOOGLE_AUTH_' + Math.random().toString(36).slice(2),
        role: userRole, // ✅ This is the critical line - using provided role
        provider: 'google',
        verified: true,
        profileImage,
      });
      
      console.log("✅ New user created successfully!");
      console.log("📋 User details:", {
        email: user.email,
        role: user.role,
        id: user._id
      });
      
    } else {
      // ✅ EXISTING USER - Keep existing role
      console.log("🔍 User exists in database");
      console.log("📋 Existing user details:", {
        email: user.email,
        currentRole: user.role,
        provider: user.provider
      });
      
      // Only update role if it's a Google user and role is different
      // This prevents changing role for existing email/password users
      const validRoles = ['player', 'admin', 'gk'];
      if (user.provider === 'google' && role && validRoles.includes(role) && user.role !== role) {
        console.log("🔄 Updating Google user role from", user.role, "to", role);
        user.role = role as 'player' | 'admin' | 'gk';
        await user.save();
        console.log("✅ Role updated successfully");
      }
    }

    // Generate tokens
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

    console.log("=== GOOGLE LOGIN BACKEND COMPLETE ===");
    console.log("Returning user with role:", userWithoutPassword.role);

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw error;
  }
};

// const googleLogin = async (idToken: string, role?: string) => {
//    console.log("Received role in backend:", role); 
//   const payload = await jwtHelpers.verifyGoogleToken(idToken);

//   const email = payload.email!;
//   const firstName = payload.given_name || payload.name || 'Google';
//   const lastName = payload.family_name || '';
//   const profileImage = payload.picture;

//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: 'GOOGLE_AUTH', // dummy password
//       role: role || 'player', // default role
//       provider: 'google',
//       verified: true,
//       profileImage,
//     });
//   }

//   // 4. generate tokens
//   const accessToken = jwtHelpers.genaretToken(
//     { id: user._id, role: user.role, email: user.email },
//     config.jwt.accessTokenSecret as Secret,
//     config.jwt.accessTokenExpires,
//   );

//   const refreshToken = jwtHelpers.genaretToken(
//     { id: user._id, role: user.role, email: user.email },
//     config.jwt.refreshTokenSecret as Secret,
//     config.jwt.refreshTokenExpires,
//   );

//   user.lastLogin = new Date();
//   await user.save();

//   const { password, ...userWithoutPassword } = user.toObject();

//   return {
//     accessToken,
//     refreshToken,
//     user: userWithoutPassword,
//   };
// };




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
};
