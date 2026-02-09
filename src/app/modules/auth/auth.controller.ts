import config from '../../config';
import AppError from '../../error/appError';
import { alreadyVerifiedHtmlTemplate } from '../../utils/alreadyVerifiedHtmlTemplate';
import catchAsync from '../../utils/catchAsycn';
import { expiredHtmlTemplate } from '../../utils/expiredHtmlTemplate';
import { invalidHtmlTemplate } from '../../utils/invalidHtmlTemplate';
import sendResponse from '../../utils/sendResponse';
import User from '../user/user.model';
import { authService } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: result,
  });
});

const verifyEmailByToken = catchAsync(async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) return res.status(400).send(invalidHtmlTemplate());

  try {
    const result = await authService.verifyEmailByToken(
      token as string,
      email as string,
    );

    if (result.status === 'already_verified') {
      return res.send(alreadyVerifiedHtmlTemplate());
    }

    // verified successfully → redirect login
    return res.redirect(`${config.frontendUrl}/login?verified=true`);
  } catch (error: any) {
    if (error.statusCode === 410) {
      return res.status(410).send(expiredHtmlTemplate());
    }
    return res.status(400).send(invalidHtmlTemplate());
  }
});

// const resendVerificationEmail = catchAsync(async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }

//   if (user.emailVerified) {
//     throw new AppError(400, 'Email already verified');
//   }

//   await authService.sendVerificationEmail(user);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Verification email sent again',
//   });
// });

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    // sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    throw new AppError(400, 'Google ID token is required');
  }

  const result = await authService.googleLogin(idToken, role);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google login successful',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const checkUserExists = catchAsync(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  const user = await User.findOne({ email: email.toString() });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User check completed',
    data: {
      exists: !!user,
      role: user?.role || null,
      provider: user?.provider || null,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP sent to your email',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyEmail(email, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Email verified successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    // sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken');
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged out successfully',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const result = await authService.changePassword(
    req.user?.id,
    oldPassword,
    newPassword,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const authController = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  logoutUser,
  changePassword,
  googleLogin,
  checkUserExists,
  verifyEmailByToken,
  // resendVerificationEmail,
};
