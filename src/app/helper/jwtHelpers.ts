import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import AppError from '../error/appError';
import { OAuth2Client } from 'google-auth-library';
import config from '../config';

const genaretToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: string | any,
): string => {
  const options: SignOptions = {
    expiresIn,
    algorithm: 'HS256',
  };

  const token = jwt.sign(payload, secret, options);

  return token;
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  const decoded = jwt.verify(token, secret);
  if (!decoded) throw new AppError(401, 'You are not authorized');
  return decoded as JwtPayload;
};

const client = new OAuth2Client(config.google.clientId!);

const verifyGoogleToken = async (idToken: string) => {
  if (!config.google.clientId) {
    throw new AppError(500, 'Google authentication client ID is not configured');
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.google.clientId!,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError(401, 'Invalid Google token');
    }

    return payload;
  } catch (error) {
    // Keep verification diagnostics in server logs, never log the ID token.
    console.error('Google token verification failed:', error instanceof Error ? error.message : 'Unknown verification error');
    throw new AppError(401, 'Google token verification failed');
  }
};

export const jwtHelpers = {
  genaretToken,
  verifyToken,
  verifyGoogleToken,
};
