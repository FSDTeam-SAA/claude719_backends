import { Request, Response, NextFunction } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { Readable } from 'stream';
import AppError from '../error/appError';

// binary path set করো
ffmpeg.setFfmpegPath(ffmpegStatic as string);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const MAX_DURATION = 180;

const checkVideoDuration = (buffer: Buffer): Promise<number> => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    ffmpeg(stream).ffprobe((err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
};

const videoLimitMiddleware = (fieldName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      if (!files) return next();

      let videoFiles: Express.Multer.File[] = [];

      if (Array.isArray(files)) {
        videoFiles = files;
      } else {
        videoFiles = files[fieldName] || [];
      }

      if (videoFiles.length === 0) return next();

      for (const file of videoFiles) {
        const duration = await checkVideoDuration(file.buffer);
        if (duration > MAX_DURATION) {
          const mins = Math.floor(duration / 60);
          const secs = Math.round(duration % 60);
          throw new AppError(
            400,
            `Video must be 3 minutes or less. Your video is ${mins}m ${secs}s.`,
          );
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default videoLimitMiddleware;