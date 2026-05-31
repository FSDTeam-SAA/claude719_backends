import express from 'express';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.get('/', auth(userRole.admin), PaymentController.getAllPayments);
router.get('/:id', auth(userRole.admin), PaymentController.getPaymentById);

export const PaymentRoutes = router;