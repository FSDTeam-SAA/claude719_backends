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

// Individual subscription payment
router.post(
  '/pay/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payIndividualSubscription,
);

// Team subscription payment
router.post(
  '/team/:teamId/pay/:id',
  SubscriptionController.payTeamSubscription,
);

// Evaluation subscription payment
router.post(
  '/evaluation/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payEvaluationSubscription,
);

// Development subscription payment
router.post(
  '/development/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payDevelopmentSubscription,
);

// Combine 2026 subscription payment
router.post(
  '/combine-2026/:id',
  auth(userRole.player, userRole.gk),
  SubscriptionController.payCombine2026Subscription,
);

export const subscriptionRouter = router;
