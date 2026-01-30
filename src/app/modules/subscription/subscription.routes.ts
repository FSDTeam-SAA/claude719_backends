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
// router.post(
//   '/pay/:id',
//   auth(userRole.player, userRole.gk),
//   SubscriptionController.paySubscription,
// );
// router.post('/:teamId/pay/:id', SubscriptionController.payTeamSubScription);

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

// // ✅ Individual subscription payment
// router.post(
//   '/pay/:id',
//   auth(userRole.player, userRole.gk, userRole.coach, userRole.admin),
//   SubscriptionController.payIndividualSubscription
// );

// // ✅ Team subscription payment
// router.post(
//   '/team/:teamId/pay/:id',
//   auth(userRole.coach, userRole.admin),
//   SubscriptionController.payTeamSubscription
// );

// // ✅ Payment Success Handler (Webhook alternative)
// router.get(
//   '/payment/success',
//   auth(userRole.player, userRole.gk, userRole.coach, userRole.admin),
//   SubscriptionController.paymentSuccessHandler
// );

// // ✅ Check payment status
// router.get(
//   '/payment/status/:orderId',
//   auth(userRole.player, userRole.gk, userRole.coach, userRole.admin),
//   SubscriptionController.paymentStatusChecker
// );

// // ✅ Manual payment verification (for testing/admin)
// router.post(
//   '/payment/verify',
//   auth(userRole.admin),
//   SubscriptionController.manualPaymentVerification
// );

export const subscriptionRouter = router;
