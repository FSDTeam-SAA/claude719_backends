import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { nationalController } from './national.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  nationalController.getSingleNational,
);
router.post(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('flag'),
  nationalController.createNational,
);
router.get('/:id', auth(userRole.admin), nationalController.getAllNational);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('flag'),
  nationalController.updateNational,
);
router.delete('/:id', auth(userRole.admin), nationalController.deleteNational);

export const nationalRouter = router;
