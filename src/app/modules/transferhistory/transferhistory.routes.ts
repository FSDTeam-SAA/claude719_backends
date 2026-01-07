import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { transferhistoryController } from './transferhistory.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.fields([
    { name: 'leftClub', maxCount: 1 },
    { name: 'leftCountery', maxCount: 1 },
    { name: 'joinedClub', maxCount: 1 },
    { name: 'joinedCountery', maxCount: 1 },
  ]),
  transferhistoryController.createTransferhistory,
);

router.get(
  '/:id',
  auth(userRole.admin),
  transferhistoryController.getAllTransferhistory,
);

router.get(
  '/single/:id',
  auth(userRole.admin),
  transferhistoryController.getSingleTransferhistory,
);

router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.fields([
    { name: 'leftClub', maxCount: 1 },
    { name: 'leftCountery', maxCount: 1 },
    { name: 'joinedClub', maxCount: 1 },
    { name: 'joinedCountery', maxCount: 1 },
  ]),
  transferhistoryController.updateTransferhistory,
);

router.delete(
  '/:id',
  auth(userRole.admin),
  transferhistoryController.deleteTransferhistory,
);

export const transferhistoryRouter = router;
