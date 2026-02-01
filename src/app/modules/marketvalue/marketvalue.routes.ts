import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { marketvalueController } from './marketvalue.controller';

const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  marketvalueController.getSingleMarketvalue,
);

router.post(
  '/:id',
  auth(userRole.admin),
  marketvalueController.createMarketvalue,
);

router.get(
  '/:id',
  auth(userRole.admin),
  marketvalueController.getAllMarketvalue,
);

router.put(
  '/:id',
  auth(userRole.admin),
  marketvalueController.updateMarketvalue,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  marketvalueController.deleteMarketvalue,
);

export const marketvalueRouter = router;
