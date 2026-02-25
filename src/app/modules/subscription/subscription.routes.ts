import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin),
  SubscriptionController.createSubscription,
);
router.get('/', SubscriptionController.getAllSubscription);
router.get('/:id', SubscriptionController.getSingleSubscription);
router.put(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.updateSubscription,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.deleteSubscription,
);
router.post(
  '/activate/:id',
  auth(userRole.player),
  SubscriptionController.activeSubscription,
);
// router.post(
//   '/pay/:id',
//   auth(userRole.player),
//   SubscriptionController.paySubscription,
// );

router.post(
  '/',
  auth(userRole.admin),
  SubscriptionController.createSubscription,
);
router.get('/', SubscriptionController.getAllSubscription);
router.get('/:id', SubscriptionController.getSingleSubscription);
router.put(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.updateSubscription,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  SubscriptionController.deleteSubscription,
);
router.post(
  '/activate/:id',
  auth(userRole.player),
  SubscriptionController.activeSubscription,
);

router.post(
  '/pay/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payIndividualSubscription,
);

// Team subscription payment (Coach or anyone with team access)
router.post(
  '/team/:teamId/pay/:id',
  SubscriptionController.payTeamSubscription,
);

router.post(
  '/evaluation/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payEvaluationSubscription,
);

export const subscriptionRouter = router;
