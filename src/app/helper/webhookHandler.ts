// webhookHandler.ts
import axios from 'axios';
import { Request, Response } from 'express';
import config from '../config';
import Payment from '../modules/payment/payment.model';
import User from '../modules/user/user.model';
import Team from '../modules/team/team.model';
import Subscription from '../modules/subscription/subscription.model';
import { SubscriptionService } from '../modules/subscription/subscription.service';

const PAYPAL_API_BASE =
  config.env === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const verifyPayPalWebhook = async (
  headers: any,
  body: Buffer,
): Promise<boolean> => {
  try {
    const auth = Buffer.from(
      `${config.paypal.clientId}:${config.paypal.clientSecret}`,
    ).toString('base64');

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: config.paypal.webhookId,
        webhook_event: JSON.parse(body.toString('utf8')),
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.verification_status === 'SUCCESS';
  } catch (err) {
    console.error('❌ Webhook verification failed', err);
    return false;
  }
};

const webHookHandlers = async (req: Request, res: Response) => {
  console.log('🔔 PayPal Webhook Hit');

  const isValid = await verifyPayPalWebhook(req.headers, req.body);

  if (!isValid) {
    console.error('❌ Invalid PayPal Webhook');
    return res.status(400).json({ message: 'Invalid webhook' });
  }

  const event = JSON.parse(req.body.toString('utf8'));
  const eventType = event.event_type;
  const resource = event.resource;

  console.log('📌 Event Type:', eventType);

  try {
    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(resource);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptured(resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.FAILED':
        await handlePaymentFailed(resource);
        break;

      default:
        console.log('ℹ️ Ignored event:', eventType);
    }
  } catch (error: any) {
    console.error('❌ Error processing webhook event:', error.message);
  }

  res.status(200).json({ received: true });
};

const handleOrderApproved = async (resource: any) => {
  const orderId = resource.id;
  console.log('🛒 Order Approved. Capturing payment for Order ID:', orderId);

  try {
    // Capture the payment using the service
    await SubscriptionService.capturePayment(orderId);
    console.log('✅ Capture initiated successfully via webhook');
  } catch (error: any) {
    console.error('❌ Failed to capture payment in webhook:', error.message);
  }
};

const handlePaymentCaptured = async (resource: any) => {
  const orderId = resource.supplementary_data?.related_ids?.order_id;
  console.log('✅ Payment Captured. Processing Order ID:', orderId);

  if (!orderId) {
    console.error('❌ No order ID found in capture event');
    return;
  }

  const payment = await Payment.findOneAndUpdate(
    { paypalOrderId: orderId },
    {
      status: 'completed',
      paypalCaptureId: resource.id,
    },
    { new: true },
  );

  if (!payment) {
    console.error('❌ Payment record not found for order:', orderId);
    return;
  }

  const subscription = await Subscription.findById(payment.subscription);
  if (!subscription) {
    console.error('❌ Subscription not found');
    return;
  }

  let expiry = new Date();
  if (subscription.interval === 'monthly')
    expiry.setMonth(expiry.getMonth() + 1);
  if (subscription.interval === 'yearly')
    expiry.setFullYear(expiry.getFullYear() + 1);

  if (payment.paymentType === 'Individual') {
    await User.findByIdAndUpdate(payment.user, {
      isSubscription: true,
      subscription: subscription._id,
      subscriptionExpiry: expiry,
    });
    console.log(`✅ User subscription activated`);
  }

  if (payment.paymentType === 'TeamGame') {
    await Team.findByIdAndUpdate(payment.team, {
      subscription: subscription._id,
      subscriptionExpiry: expiry,
    });
    console.log(`✅ Team subscription activated`);
  }
};

const handlePaymentFailed = async (resource: any) => {
  const orderId = resource.supplementary_data?.related_ids?.order_id;

  if (!orderId) return;

  await Payment.findOneAndUpdate(
    { paypalOrderId: orderId },
    {
      status: 'failed',
      paypalCaptureId: resource.id,
      failureReason: resource.status || 'PAYMENT_FAILED',
    },
  );

  console.log('❌ Payment failed for order:', orderId);
};

export default webHookHandlers;
