import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { setpiecesController } from './setpieces.controller';

const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  setpiecesController.getSingleSetpieces,
);

router.post('/:id', auth(userRole.admin), setpiecesController.createSetpieces);

router.get('/:id', auth(userRole.admin), setpiecesController.getAllSetpieces);

router.put('/:id', auth(userRole.admin), setpiecesController.updateSetpieces);
router.delete(
  '/:id',
  auth(userRole.admin),
  setpiecesController.deleteSetpieces,
);

export const setpiecesRouter = router;
