import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { gkDistributionstatsController } from './gkdistributionstats.controller';

const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  gkDistributionstatsController.getSingleGkDistributionstats,
);

router.post(
  '/:id',
  auth(userRole.admin),
  gkDistributionstatsController.createGkDistributionstats,
);

router.get(
  '/:id',
  auth(userRole.admin),
  gkDistributionstatsController.getAllGkDistributionstats,
);

router.put(
  '/:id',
  auth(userRole.admin),
  gkDistributionstatsController.updateGkDistributionstats,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  gkDistributionstatsController.deleteGkDistributionstats,
);

export const gkDistributionstatsRouter = router;
