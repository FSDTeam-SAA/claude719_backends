import express from 'express';
import { coponController } from './copon.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';

const router = express.Router();

router.post('/create-copon', auth(userRole.admin), coponController.createCopon);
router.get('/get-all-copon', auth(userRole.admin), coponController.getAllCopon);
router.post(
  '/apply-copon',
  auth(userRole.user, userRole.player, userRole.admin),
  coponController.applyCopon
);
router.get(
  '/get-single-copon/:id',
  auth(userRole.admin),
  coponController.getSingleCopon,
);
router.get(
  '/get-single-copon-code/:code',
  auth(userRole.admin),
  coponController.getSingleCoponCode,
);
router.put(
  '/update-copon/:id',
  auth(userRole.admin),
  coponController.updateCopon,
);
router.delete(
  '/delete-copon/:id',
  auth(userRole.admin),
  coponController.deleteCopon,
);

export const coponRoutes = router;
