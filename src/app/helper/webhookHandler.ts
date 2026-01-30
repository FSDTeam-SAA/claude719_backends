// import Stripe from 'stripe';
// import config from '../config';
// import { Request, Response } from 'express';
// import Payment from '../modules/payment/payment.model';
// import User from '../modules/user/user.model';
// import Subscription from '../modules/subscription/subscription.model';
// import Team from '../modules/team/team.model';
// import sendMailer from './sendMailer';

// const stripe = new Stripe(config.stripe.secretKey!);

// const webHookHandlers = async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       config.stripe.webhookSecret!,
//     );
//   } catch (err: any) {
//     console.error('❌ Webhook Error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     /* ================= CHECKOUT COMPLETED ================= */
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;

//       const payment = await Payment.findOne({ stripeSessionId: session.id });
//       if (!payment) return res.status(200).json({ received: true });

//       payment.status = 'completed';
//       payment.stripePaymentIntentId = session.payment_intent as string;
//       await payment.save();

//       const paymentType = session.metadata?.paymentType;

//       /* ================= INDIVIDUAL ================= */
//       if (paymentType === 'Individual') {
//         const user = await User.findById(payment.user);
//         const subscription = await Subscription.findById(payment.subscription);
//         if (!user || !subscription)
//           return res.status(200).json({ received: true });

//         if (!subscription.totalSubscripeUser.includes(user._id)) {
//           subscription.totalSubscripeUser.push(user._id);
//           await subscription.save();
//         }

//         const months = subscription.interval === 'yearly' ? 12 : 1;
//         const expiry = new Date();
//         expiry.setMonth(expiry.getMonth() + months);

//         user.isSubscription = true;
//         user.subscription = subscription._id;
//         user.subscriptionExpiry = expiry;
//         user.numberOfGame = subscription.numberOfGames ?? undefined;
//         await user.save();
//       }

//       /* ================= TEAM GAME ================= */
//       if (paymentType === 'TeamGame') {
//         const team = await Team.findById(payment.team);
//         const subscription = await Subscription.findById(payment.subscription);
//         if (!team || !subscription)
//           return res.status(200).json({ received: true });

//         if (!subscription.totalSubscripeTeam.includes(team._id)) {
//           subscription.totalSubscripeTeam.push(team._id);
//           await subscription.save();
//         }

//         // const months = subscription.interval === 'yearly' ? 12 : 1;
//         // const expiry = new Date();
//         // expiry.setMonth(expiry.getMonth() + months);

//         team.subscription = subscription._id;
//         // team.subscriptionExpiry = null;
//         await team.save();

//         /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
//         await Promise.all(
//           team.players.map(async (player) => {
//             const exists = await User.findOne({ email: player.email });
//             if (exists) return;

//             const password = Math.random().toString(36).slice(-8);

//             const newUser = await User.create({
//               firstName: player.name,
//               lastName: '',
//               email: player.email,
//               role: player.role,
//               category: team.category,
//               league: team.league,
//               password,
//               isSubscription: true,
//               subscription: subscription._id,
//               // subscriptionExpiry: expiry,
//               numberOfGame: subscription.numberOfGames,
//               team: team._id,
//             });

//             await sendMailer(
//               newUser.email,
//               'Team Game Subscription',
//               `Your password: ${password}\n Email: ${newUser.email}`,
//             );
//           }),
//         );
//       }

//       return res.status(200).json({ received: true });
//     }

//     /* ================= PAYMENT FAILED ================= */
//     if (event.type === 'payment_intent.payment_failed') {
//       const intent = event.data.object as Stripe.PaymentIntent;

//       const payment = await Payment.findOne({
//         stripePaymentIntentId: intent.id,
//       });

//       if (payment) {
//         payment.status = 'failed';
//         await payment.save();
//       }
//     }

//     return res.status(200).json({ received: true });
//   } catch (err: any) {
//     console.error('❌ Handler Error:', err.message);
//     return res.status(500).send(`Webhook Handler Error: ${err.message}`);
//   }
// };

// export default webHookHandlers;

//===================== update paypal code ===========================================
// import { Request, Response } from 'express';
// import Payment from '../modules/payment/payment.model';
// import User from '../modules/user/user.model';
// import Subscription from '../modules/subscription/subscription.model';
// import Team from '../modules/team/team.model';
// import sendMailer from './sendMailer';

// const webHookHandlers = async (req: Request, res: Response) => {
//   // Basic webhook validation - check if request has PayPal headers
//   if (!req.headers['paypal-transmission-id']) {
//     console.error('❌ Invalid PayPal webhook request');
//     return res.status(400).send('Invalid webhook request');
//   }

//   try {
//     const event = req.body;
//     console.log('📥 Received PayPal webhook:', event.event_type);
//     console.log('📦 Event data:', JSON.stringify(event, null, 2));

//     console.log('Event type:', event.event_type);

//     /* ================= CHECKOUT COMPLETED ================= */
//     if (
//       event.event_type === 'CHECKOUT.ORDER.APPROVED' ||
//       event.event_type === 'PAYMENT.CAPTURE.COMPLETED'
//     ) {
//       const orderId = event.resource.id;
//       console.log('✅ Payment completed for order:', orderId);

//       const payment = await Payment.findOne({ paypalOrderId: orderId });
//       if (!payment) {
//         console.log('⚠️ Payment record not found for order:', orderId);
//         return res.status(200).json({ received: true });
//       }

//       payment.status = 'completed';
//       payment.paypalCaptureId = event.resource.id;
//       await payment.save();

//       console.log('💾 Payment status updated to completed');

//       const paymentType = payment.paymentType;

//       /* ================= INDIVIDUAL ================= */
//       if (paymentType === 'Individual') {
//         const user = await User.findById(payment.user);
//         const subscription = await Subscription.findById(payment.subscription);

//         if (!user || !subscription) {
//           console.log('⚠️ User or subscription not found');
//           return res.status(200).json({ received: true });
//         }

//         if (!subscription.totalSubscripeUser.includes(user._id)) {
//           subscription.totalSubscripeUser.push(user._id);
//           await subscription.save();
//           console.log('📝 User added to subscription list');
//         }

//         const months = subscription.interval === 'yearly' ? 12 : 1;
//         const expiry = new Date();
//         expiry.setMonth(expiry.getMonth() + months);

//         user.isSubscription = true;
//         user.subscription = subscription._id;
//         user.subscriptionExpiry = expiry;
//         user.numberOfGame = subscription.numberOfGames ?? undefined;
//         await user.save();

//         console.log('✅ Individual subscription activated for user:', user._id);

//         // Send confirmation email
//         const emailBody = `
//           <h2>Payment Confirmation</h2>
//           <p>Dear ${user.firstName} ${user.lastName},</p>
//           <p>Thank you for your payment! Your subscription has been activated successfully.</p>
//           <p><strong>Subscription:</strong> ${subscription.title}</p>
//           <p><strong>Amount:</strong> $${payment.amount}</p>
//           <p><strong>Expires:</strong> ${expiry.toLocaleDateString()}</p>
//           <p>Best regards,<br>Your Team</p>
//         `;

//         try {
//           await sendMailer(
//             user.email,
//             'Subscription Activated',
//             emailBody,
//           );
//           console.log('📧 Confirmation email sent to:', user.email);
//         } catch (emailError) {
//           console.error('❌ Failed to send email:', emailError);
//         }
//       }

//       /* ================= TEAM GAME ================= */
//       if (paymentType === 'TeamGame') {
//         const team = await Team.findById(payment.team);
//         const subscription = await Subscription.findById(payment.subscription);

//         if (!team || !subscription) {
//           console.log('⚠️ Team or subscription not found');
//           return res.status(200).json({ received: true });
//         }

//         if (!subscription.totalSubscripeTeam.includes(team._id)) {
//           subscription.totalSubscripeTeam.push(team._id);
//           await subscription.save();
//           console.log('📝 Team added to subscription list');
//         }

//         team.subscription = subscription._id;
//         await team.save();

//         console.log('✅ Team subscription activated for team:', team._id);

//         /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
//         if (team.players && team.players.length > 0) {
//           console.log(`👥 Creating ${team.players.length} team player accounts...`);

//           await Promise.all(
//             team.players.map(async (player: any) => {
//               const exists = await User.findOne({ email: player.email });
//               if (exists) {
//                 console.log(`⏭️ Player already exists: ${player.email}`);
//                 return;
//               }

//               const password = Math.random().toString(36).slice(-8);

//               const newUser = await User.create({
//                 firstName: player.name,
//                 lastName: '',
//                 email: player.email,
//                 role: player.role,
//                 category: team.category,
//                 league: team.league,
//                 password,
//                 isSubscription: true,
//                 subscription: subscription._id,
//                 numberOfGame: subscription.numberOfGames,
//                 team: team._id,
//               });

//               await sendMailer(
//                 newUser.email,
//                 'Team Game Subscription',
//                 `Your password: ${password}\n Email: ${newUser.email}`,
//               );

//               console.log('✅ Created user for team player:', newUser.email);
//             }),
//           );
//         }
//       }

//       return res.status(200).json({ received: true });
//     }

//     /* ================= PAYMENT FAILED ================= */
//     if (
//       event.event_type === 'PAYMENT.CAPTURE.DENIED' ||
//       event.event_type === 'CHECKOUT.ORDER.DECLINED'
//     ) {
//       const orderId = event.resource.id;
//       console.log('❌ Payment failed for order:', orderId);

//       const payment = await Payment.findOne({
//         paypalOrderId: orderId,
//       });

//       if (payment) {
//         payment.status = 'failed';
//         await payment.save();
//         console.log('✅ Payment status updated to failed');
//       }
//     }

//     return res.status(200).json({ received: true });
//   } catch (err: any) {
//     console.error('❌ Webhook Handler Error:', err.message);
//     console.error('Stack:', err.stack);
//     return res.status(500).send(`Webhook Handler Error: ${err.message}`);
//   }
// };

// export default webHookHandlers;

//=============================================================================

// webhookHandler.ts
import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config';
import Payment from '../modules/payment/payment.model';
import subscriptionModel from '../modules/subscription/subscription.model';
import User from '../modules/user/user.model';
import Team from '../modules/team/team.model';

const PAYPAL_API_BASE =
  config.env === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// const verifyWebhookSignature = async (
//   headers: any,
//   body: any,
//   webhookId: string,
// ) => {
//   try {
//     const auth = Buffer.from(
//       `${config.paypal.clientId}:${config.paypal.clientSecret}`,
//     ).toString('base64');

//     const response = await axios.post(
//       `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
//       {
//         transmission_id: headers['paypal-transmission-id'],
//         transmission_time: headers['paypal-transmission-time'],
//         cert_url: headers['paypal-cert-url'],
//         auth_algo: headers['paypal-auth-algo'],
//         transmission_sig: headers['paypal-transmission-sig'],
//         webhook_id: webhookId,
//         webhook_event: body,
//       },
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//     console.log('✅ Webhook signature verified', response.data);

//     return response.data.verification_status === 'SUCCESS';
//   } catch (error) {
//     console.error('❌ Webhook verification failed:', error);
//     return false;
//   }
// };


const verifyWebhookSignature = async (
  headers: any,
  body: any,
  webhookId: string,
) => {
  try {
    console.log('🔍 Webhook Verification Debug Info:');
    console.log('   Webhook ID from config:', webhookId);
    
    // Parse the body from Buffer to JSON
    let webhookEvent;
    try {
      // If body is a Buffer, convert to string and parse
      if (Buffer.isBuffer(body)) {
        webhookEvent = JSON.parse(body.toString('utf8'));
      } else if (typeof body === 'string') {
        webhookEvent = JSON.parse(body);
      } else {
        webhookEvent = body;
      }
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body:', parseError);
      return false;
    }

    // Extract webhook ID from the event for comparison
    const incomingWebhookId = webhookEvent.id?.split('-')[0];
    console.log('   Incoming Webhook ID:', incomingWebhookId);
    
    // Use the incoming webhook ID if available, otherwise use config
    const actualWebhookId = incomingWebhookId || webhookId;
    console.log('   Using Webhook ID:', actualWebhookId);

    const auth = Buffer.from(
      `${config.paypal.clientId}:${config.paypal.clientSecret}`,
    ).toString('base64');

    // Prepare the verification payload with PARSED JSON, not Buffer
    const verificationPayload = {
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: actualWebhookId, // Use the correct webhook ID
      webhook_event: webhookEvent, // Send parsed JSON, not Buffer
    };

    console.log('📤 Sending verification to PayPal...');
    console.log('   Payload keys:', Object.keys(verificationPayload));
    
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      verificationPayload,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    );

    console.log('📥 PayPal Verification Response:');
    console.log('   Status:', response.data.verification_status);
    console.log('   Debug ID:', response.data.debug_id);
    
    if (response.data.verification_status === 'FAILURE') {
      console.error('❌ Verification failed. Possible reasons:');
      console.error('   1. Webhook ID mismatch');
      console.error('   2. Invalid client credentials');
      console.error('   3. Webhook not properly configured');
      console.error('   4. Timestamp mismatch');
      
      // Try with just the base webhook ID (without the suffix)
      const baseWebhookId = webhookId.split('-')[0];
      if (baseWebhookId !== webhookId) {
        console.log('🔄 Trying with base webhook ID:', baseWebhookId);
        
        const retryPayload = {
          ...verificationPayload,
          webhook_id: baseWebhookId,
        };
        
        try {
          const retryResponse = await axios.post(
            `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
            retryPayload,
            {
              headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
              },
            },
          );
          
          console.log('🔄 Retry Response:', retryResponse.data.verification_status);
          return retryResponse.data.verification_status === 'SUCCESS';
        } catch (retryError) {
          console.error('❌ Retry also failed');
        }
      }
    }

    return response.data.verification_status === 'SUCCESS';
  } catch (error: any) {
    console.error('❌ Webhook verification error:');
    console.error('   Status:', error.response?.status);
    console.error('   Debug ID:', error.response?.data?.debug_id);
    console.error('   Error:', error.response?.data?.message);
    console.error('   Details:', error.response?.data?.details);
    
    if (error.response?.data?.details) {
      error.response.data.details.forEach((detail: any, index: number) => {
        console.error(`   Detail ${index + 1}:`, detail);
      });
    }
    
    return false;
  }
};


const webHookHandlers = async (req: Request, res: Response) => {
  try {
    console.log('🎯 Processing webhook...');

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(
      req.headers,
      req.body,
      config.paypal.webhookId!,
    );
    console.log(
      '✅ Webhook signature verified',
      isValid,
      config.paypal.webhookId!,
    );

    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString('utf8'));
    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`📌 Event: ${eventType}`);
    console.log(`💰 Order ID: ${resource.id}`);

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(resource);
        break;

      case 'CHECKOUT.ORDER.COMPLETED':
        await handleCheckoutOrderCompleted(resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.FAILED':
        await handlePaymentFailed(resource);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handlePaymentCaptureCompleted = async (resource: any) => {
  console.log('✅ Payment captured successfully');
  console.log('💰 Capture ID:', resource.id);
  console.log('📝 Order ID:', resource.supplementary_data.related_ids.order_id);

  const orderId = resource.supplementary_data?.related_ids?.order_id;

  if (!orderId) {
    console.error('❌ No order ID found in webhook');
    return;
  }

  // Find and update payment
  const payment = await Payment.findOneAndUpdate(
    { paypalOrderId: orderId },
    {
      status: 'completed',
      paypalCaptureId: resource.id,
      updatedAt: new Date(),
    },
    { new: true },
  ).populate('user subscription team');

  if (!payment) {
    console.error('❌ Payment not found for order:', orderId);
    return;
  }

  console.log('📊 Payment updated:', payment._id);

  // Update user/team subscription based on payment type
  if (payment.paymentType === 'Individual' && payment.user) {
    // Calculate expiry date
    const subscription = await subscriptionModel.findById(payment.subscription);
    let expiryDate = new Date();

    if (subscription?.interval === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (subscription?.interval === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update user
    await User.findByIdAndUpdate(payment.user._id, {
      isSubscription: true,
      subscription: payment.subscription,
      subscriptionExpiry: expiryDate,
    });

    console.log(
      `✅ User ${payment.user._id} subscription activated until ${expiryDate}`,
    );
  } else if (payment.paymentType === 'TeamGame' && payment.team) {
    // Update team subscription logic here
    const subscription = await subscriptionModel.findById(payment.subscription);
    let expiryDate = new Date();

    if (subscription?.interval === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (subscription?.interval === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update team subscription logic
    await Team.findByIdAndUpdate(payment.team._id, {
      subscription: payment.subscription,
      subscriptionExpiry: expiryDate,
    });

    console.log(
      `✅ Team ${payment.team._id} subscription activated until ${expiryDate}`,
    );
  }
};

const handleCheckoutOrderCompleted = async (resource: any) => {
  console.log('🛒 Checkout order completed');
  console.log('💰 Order ID:', resource.id);

  // Update payment status to completed
  await Payment.findOneAndUpdate(
    { paypalOrderId: resource.id },
    { status: 'completed', updatedAt: new Date() },
  );
};

const handlePaymentFailed = async (resource: any) => {
  console.error('❌ Payment failed:', resource);

  const orderId = resource.supplementary_data?.related_ids?.order_id;
  if (orderId) {
    await Payment.findOneAndUpdate(
      { paypalOrderId: orderId },
      { status: 'failed', updatedAt: new Date() },
    );
  }
};

export default webHookHandlers;

//==============================================================================

// webhookHandler.ts
// import { Request, Response } from 'express';
// import Payment from '../modules/payment/payment.model';
// import User from '../modules/user/user.model';
// import Subscription from '../modules/subscription/subscription.model';
// import Team from '../modules/team/team.model';
// import sendMailer from './sendMailer';

// const webHookHandlers = async (req: Request, res: Response) => {
//   // Basic webhook validation
//   if (!req.headers['paypal-transmission-id']) {
//     console.error('❌ Invalid PayPal webhook request');
//     return res.status(400).send('Invalid webhook request');
//   }

//   try {
//     const event = req.body;
//     console.log('📥 Received PayPal webhook:', event.event_type);

//     /* ================= CHECKOUT COMPLETED ================= */
//     if (
//       event.event_type === 'CHECKOUT.ORDER.APPROVED' ||
//       event.event_type === 'PAYMENT.CAPTURE.COMPLETED'
//     ) {
//       const orderId = event.resource.id;
//       console.log('✅ Payment completed for order:', orderId);

//       // Find payment by PayPal order ID
//       const payment = await Payment.findOne({ paypalOrderId: orderId });
//       if (!payment) {
//         console.log('⚠️ Payment record not found for order:', orderId);
//         return res.status(200).json({ received: true });
//       }

//       // Update payment status
//       payment.status = 'completed';
//       payment.paypalCaptureId = event.resource.id;
//       await payment.save();
//       console.log('💾 Payment status updated to completed');

//       const paymentType = payment.paymentType;

//       /* ================= INDIVIDUAL PAYMENT ================= */
//       if (paymentType === 'Individual') {
//         console.log('👤 Processing Individual subscription...');

//         // Find user and subscription
//         const user = await User.findById(payment.user);
//         const subscription = await Subscription.findById(payment.subscription);

//         if (!user) {
//           console.log('⚠️ User not found for ID:', payment.user);
//           return res.status(200).json({ received: true });
//         }

//         if (!subscription) {
//           console.log('⚠️ Subscription not found for ID:', payment.subscription);
//           return res.status(200).json({ received: true });
//         }

//         // Add user to subscription's totalSubscripeUser array
//         if (!subscription.totalSubscripeUser.includes(user._id)) {
//           subscription.totalSubscripeUser.push(user._id);
//           await subscription.save();
//           console.log('📝 User added to subscription list');
//         }

//         // Calculate expiry date
//         const months = subscription.interval === 'yearly' ? 12 : 1;
//         const expiry = new Date();
//         expiry.setMonth(expiry.getMonth() + months);

//         // Update user subscription info
//         user.isSubscription = true;
//         user.subscription = subscription._id;
//         user.subscriptionExpiry = expiry;
//         user.numberOfGame = subscription.numberOfGames || 0; // Default to 0 if null
//         await user.save();

//         console.log('✅ Individual subscription activated for user:', user.email);
//         console.log('📅 Subscription expires on:', expiry.toISOString());

//         // Send confirmation email
//         const emailBody = `
//           <h2>Payment Confirmation</h2>
//           <p>Dear ${user.firstName} ${user.lastName},</p>
//           <p>Thank you for your payment! Your subscription has been activated successfully.</p>
//           <p><strong>Subscription:</strong> ${subscription.title}</p>
//           <p><strong>Amount:</strong> $${payment.amount}</p>
//           <p><strong>Expires:</strong> ${expiry.toLocaleDateString()}</p>
//           <p><strong>Number of Games:</strong> ${subscription.numberOfGames || 'Unlimited'}</p>
//           <p>Best regards,<br>Your Team</p>
//         `;

//         try {
//           await sendMailer(
//             user.email,
//             'Subscription Activated',
//             emailBody,
//           );
//           console.log('📧 Confirmation email sent to:', user.email);
//         } catch (emailError) {
//           console.error('❌ Failed to send email:', emailError);
//         }
//       }

//       /* ================= TEAM GAME PAYMENT ================= */
//       else if (paymentType === 'TeamGame') {
//         console.log('👥 Processing Team Game subscription...');

//         // Find team and subscription
//         const team = await Team.findById(payment.team);
//         const subscription = await Subscription.findById(payment.subscription);

//         if (!team) {
//           console.log('⚠️ Team not found for ID:', payment.team);
//           return res.status(200).json({ received: true });
//         }

//         if (!subscription) {
//           console.log('⚠️ Subscription not found for ID:', payment.subscription);
//           return res.status(200).json({ received: true });
//         }

//         // Add team to subscription's totalSubscripeTeam array
//         if (!subscription.totalSubscripeTeam.includes(team._id)) {
//           subscription.totalSubscripeTeam.push(team._id);
//           await subscription.save();
//           console.log('📝 Team added to subscription list');
//         }

//         // Update team subscription
//         team.subscription = subscription._id;
//         await team.save();

//         console.log('✅ Team subscription activated for team:', team.teamName);

//         /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
//         if (team.players && team.players.length > 0) {
//           console.log(`👥 Creating ${team.players.length} team player accounts...`);

//           const userCreationPromises = team.players.map(async (player: any) => {
//             // Check if user already exists
//             const existingUser = await User.findOne({ email: player.email });
//             if (existingUser) {
//               console.log(`⏭️ Player already exists: ${player.email}`);

//               // Update existing user's subscription info
//               existingUser.isSubscription = true;
//               existingUser.subscription = subscription._id;
//               existingUser.team = team._id;
//               existingUser.numberOfGame = subscription.numberOfGames || 0;
//               await existingUser.save();

//               return existingUser;
//             }

//             // Create new user for team player
//             const password = Math.random().toString(36).slice(-8);

//             const newUser = await User.create({
//               firstName: player.name || player.firstName || 'Player',
//               lastName: player.lastName || '',
//               email: player.email,
//               role: player.role || 'player',
//               category: team.category,
//               league: team.league,
//               password: password,
//               isSubscription: true,
//               subscription: subscription._id,
//               numberOfGame: subscription.numberOfGames || 0,
//               team: team._id,
//               verified: true,
//               provider: 'credentials',
//             });

//             // Send account creation email
//             await sendMailer(
//               newUser.email,
//               'Team Game Subscription - Account Created',
//               `
//               <h2>Welcome to the Team!</h2>
//               <p>Your account has been created for team: ${team.teamName}</p>
//               <p><strong>Email:</strong> ${newUser.email}</p>
//               <p><strong>Password:</strong> ${password}</p>
//               <p>Please login and change your password immediately.</p>
//               <p><strong>Subscription:</strong> ${subscription.title}</p>
//               <p><strong>Number of Games:</strong> ${subscription.numberOfGames || 'Unlimited'}</p>
//               `,
//             );

//             console.log('✅ Created user for team player:', newUser.email);
//             return newUser;
//           });

//           await Promise.all(userCreationPromises);
//           console.log('✅ All team player accounts processed');
//         }
//       }

//       return res.status(200).json({ received: true });
//     }

//     /* ================= PAYMENT FAILED ================= */
//     if (
//       event.event_type === 'PAYMENT.CAPTURE.DENIED' ||
//       event.event_type === 'CHECKOUT.ORDER.DECLINED'
//     ) {
//       const orderId = event.resource.id;
//       console.log('❌ Payment failed for order:', orderId);

//       const payment = await Payment.findOne({
//         paypalOrderId: orderId,
//       });

//       if (payment) {
//         payment.status = 'failed';
//         await payment.save();
//         console.log('✅ Payment status updated to failed');
//       }
//     }

//     return res.status(200).json({ received: true });
//   } catch (err: any) {
//     console.error('❌ Webhook Handler Error:', err.message);
//     console.error('Stack:', err.stack);
//     return res.status(500).send(`Webhook Handler Error: ${err.message}`);
//   }
// };

// export default webHookHandlers;
