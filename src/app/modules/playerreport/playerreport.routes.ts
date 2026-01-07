import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { PlayerreportController } from './playerreport.controller';

const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  PlayerreportController.getSinglePlayerreport,
);

router.post(
  '/:id',
  auth(userRole.admin),
  PlayerreportController.createPlayerreport,
);

router.get(
  '/:id',
  auth(userRole.admin),
  PlayerreportController.getAllPlayerreports,
);

router.put(
  '/:id',
  auth(userRole.admin),
  PlayerreportController.updatePlayerreport,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  PlayerreportController.deletePlayerreport,
);

export const playerReportRouter = router;
