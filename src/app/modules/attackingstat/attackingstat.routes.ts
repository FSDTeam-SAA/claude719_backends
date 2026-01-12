import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { attackingstatController } from './attackingstat.controller';
const router = express.Router();

router.get(
  '/single/:id',
  auth(userRole.admin),
  attackingstatController.getSingleAttackingstat,
);
// router.post(
//   '/:id',
//   auth(userRole.admin),
//   attackingstatController.createAttackingstat,
// );
router.post(
  '/:id',
  auth(userRole.admin),
  attackingstatController.createOrUpdateAttackingstat,
);
router.get(
  '/:id',
  auth(userRole.admin),
  attackingstatController.getAllAttackingstat,
);

router.put(
  '/:id',
  auth(userRole.admin),
  attackingstatController.updateAttackingstat,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  attackingstatController.deleteAttackingstat,
);

export const attackingRouter = router;
