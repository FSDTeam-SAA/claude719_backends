import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { ratingController } from './rating.controller';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  ratingController.getSingleRating,
);
router.post('/:id', auth(userRole.admin), ratingController.createRating);
router.get('/:id', auth(userRole.admin), ratingController.getAllRating);
router.put('/:id', auth(userRole.admin), ratingController.updateRating);
router.delete('/:id', auth(userRole.admin), ratingController.deleteRating);

export const ratingRouter = router;
