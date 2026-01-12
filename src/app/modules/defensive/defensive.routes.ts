import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';
import { defensiveController } from './defensive.controller';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  defensiveController.getSingleNational,
);
// router.post(
//   '/:id',
//   auth(userRole.admin),
//   fileUploader.upload.single('flag'),
//   defensiveController.createDefensive,
// );
router.post(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('flag'),
  defensiveController.createOrUpdateDefensive,
);
router.get('/:id', auth(userRole.admin), defensiveController.getAllDefensive);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('flag'),
  defensiveController.updateDefensive,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  defensiveController.deleteDefensive,
);

export const defensiveRouter = router;
