// ======================================== file uploade ==========================================================================

// import multer from 'multer';
// import streamifier from 'streamifier';
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import AppError from '../error/appError';
// import config from '../config';

// // Cloudinary Config
// cloudinary.config({
//   cloud_name: config.cloudinary.name!,
//   api_key: config.cloudinary.apiKey!,
//   api_secret: config.cloudinary.apiSecret!,
// });

// // sanitize filename
// const sanitizeFileName = (name: string) => {
//   return name
//     .replace(/\s+/g, '_')
//     .replace(/[^a-zA-Z0-9._-]/g, '')
//     .toLowerCase();
// };

// // Multer memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
//     const ext = path.extname(file.originalname).toLowerCase();

//     if (allowedTypes.test(ext)) {
//       cb(null, true);
//     } else {
//       cb(new AppError(400, 'Only images & videos are allowed'));
//     }
//   },
// });

// // Upload stream to Cloudinary
// const uploadToCloudinary = (
//   file: Express.Multer.File,
// ): Promise<{ url: string; public_id: string }> => {
//   return new Promise((resolve, reject) => {
//     if (!file) return reject(new AppError(400, 'No file provided'));

//     const ext = path.extname(file.originalname).toLowerCase();
//     const isVideo = /mp4|mov|avi|mkv/.test(ext);
//     const safeName = `${Date.now()}-${sanitizeFileName(file.originalname)}`;

//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'Note',
//         resource_type: isVideo ? 'video' : 'image',
//         public_id: safeName,
//         ...(isVideo
//           ? {}
//           : {
//               transformation: {
//                 width: 500,
//                 height: 500,
//                 crop: 'limit',
//               },
//             }),
//       },
//       (error, result) => {
//         if (error || !result)
//           return reject(error || new AppError(400, 'Cloudinary upload failed'));

//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       },
//     );

//     streamifier.createReadStream(file.buffer).pipe(stream);
//   });
// };

// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

// ======================================== file uploade aws ==========================================================================
// import multer from 'multer';
// import path from 'path';
// import { S3Client } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import AppError from '../error/appError';
// import config from '../config';

// // AWS S3 Config
// const s3Client = new S3Client({
//   region: config.aws.region!,
//   credentials: {
//     accessKeyId: config.aws.accessKeyId!,
//     secretAccessKey: config.aws.secretAccessKey!,
//   },
// });

// // sanitize filename
// const sanitizeFileName = (name: string) => {
//   return name
//     .replace(/\s+/g, '_')
//     .replace(/[^a-zA-Z0-9._-]/g, '')
//     .toLowerCase();
// };

// // Multer memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|csv|pdf|webp/;
//     const ext = path.extname(file.originalname).toLowerCase();

//     if (!allowedTypes.test(ext)) {
//       return cb(
//         new AppError(400, 'Only images, videos, and PDF files are allowed'),
//       );
//     }

//     cb(null, true);
//   },
// });

// const uploadToCloudinary = async (
//   file: Express.Multer.File,
// ): Promise<{ url: string; public_id: string }> => {
//   if (!file) throw new AppError(400, 'No file provided');

//   const ext = path.extname(file.originalname).toLowerCase();
//   const safeName = `${Date.now()}-${sanitizeFileName(file.originalname)}`;
//   const key = `Note/${safeName}`;

//   const upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket: config.aws.bucket!,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     },
//   });

//   try {
//     const result = await upload.done();
//     return {
//       url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
//       public_id: key,
//     };
//   } catch (error) {
//     console.error('S3 Upload Error:', error); // 👈 Add this line to see actual error
//     throw new AppError(
//       400,
//       `S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
//     );
//   }
// };
// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

//============================================================================================================================================
import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import AppError from '../error/appError';
import config from '../config';

// ================= AWS S3 CONFIG =================

const s3Client = new S3Client({
  region: config.aws.region!,
  credentials: {
    accessKeyId: config.aws.accessKeyId!,
    secretAccessKey: config.aws.secretAccessKey!,
  },
});

// ================= FILE NAME SANITIZE =================

const sanitizeFileName = (name: string) => {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();
};

// ================= MULTER CONFIG =================

const upload = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 50 * 1024 * 1024, // 50MB limit
  // },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|csv|pdf|webp/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.test(ext)) {
      return cb(
        new AppError(
          400,
          'Only images, videos, CSV, and PDF files are allowed',
        ),
      );
    }

    cb(null, true);
  },
});

// ================= S3 UPLOAD FUNCTION =================

const uploadToS3 = async (
  file: Express.Multer.File,
): Promise<{ url: string; public_id: string }> => {
  if (!file) {
    throw new AppError(400, 'No file provided');
  }

  const safeName = `${Date.now()}-${sanitizeFileName(file.originalname)}`;
  const key = `Note/${safeName}`;

  const uploader = new Upload({
    client: s3Client,
    params: {
      Bucket: config.aws.bucket!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  try {
    await uploader.done();

    return {
      url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
      public_id: key,
    };
  } catch (error: any) {
    console.error('S3 Upload Error:', error);
    console.error('S3 Error Message:', error?.message);

    throw new AppError(400, `S3 upload failed: ${error?.message}`);
  }
};

// ================= EXPORT =================

export const fileUploader = {
  upload,
  uploadToS3,
};
