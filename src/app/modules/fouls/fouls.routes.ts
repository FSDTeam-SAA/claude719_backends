import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { foulsController } from './fouls.controller';
const router = express.Router();

router.get('/single/:id', auth(userRole.admin), foulsController.getSingleFouls);

router.post('/:id', auth(userRole.admin), foulsController.createFouls);
// router.post('/:id', auth(userRole.admin), foulsController.createOrUpdateFouls);

router.get('/:id', auth(userRole.admin), foulsController.getAllFouls);

router.put('/:id', auth(userRole.admin), foulsController.updateFouls);
router.delete('/:id', auth(userRole.admin), foulsController.deleteFouls);

export const foulsRouter = router;
