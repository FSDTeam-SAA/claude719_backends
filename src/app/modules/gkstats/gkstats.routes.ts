import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { gkStatsController } from './gkstats.controller';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  gkStatsController.getSingleGkStats,
);

router.post('/:id', auth(userRole.admin), gkStatsController.createGkStats);

router.get('/:id', auth(userRole.admin), gkStatsController.getAllGkStats);

router.put('/:id', auth(userRole.admin), gkStatsController.updateGkStats);
router.delete('/:id', auth(userRole.admin), gkStatsController.deleteGkStats);

export const gkstatsRouter = router;
