import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { distributionstatsController } from './distributionstats.controller';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  distributionstatsController.getSingleDistributionstats,
);

router.post(
  '/:id',
  auth(userRole.admin),
  distributionstatsController.createDistributionstats,
);

router.get(
  '/:id',
  auth(userRole.admin),
  distributionstatsController.getAllDistributionstats,
);

router.put(
  '/:id',
  auth(userRole.admin),
  distributionstatsController.updateDistributionstats,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  distributionstatsController.deleteDistributionstats,
);

export const distributionstatsRouter = router;
