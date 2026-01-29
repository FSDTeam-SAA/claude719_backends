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



// webhookHandler.ts
import { Request, Response } from 'express';
import Payment from '../modules/payment/payment.model';
import User from '../modules/user/user.model';
import Subscription from '../modules/subscription/subscription.model';
import Team from '../modules/team/team.model';
import sendMailer from './sendMailer';

const webHookHandlers = async (req: Request, res: Response) => {
  // Basic webhook validation
  if (!req.headers['paypal-transmission-id']) {
    console.error('❌ Invalid PayPal webhook request');
    return res.status(400).send('Invalid webhook request');
  }

  try {
    const event = req.body;
    console.log('📥 Received PayPal webhook:', event.event_type);

    /* ================= CHECKOUT COMPLETED ================= */
    if (
      event.event_type === 'CHECKOUT.ORDER.APPROVED' ||
      event.event_type === 'PAYMENT.CAPTURE.COMPLETED'
    ) {
      const orderId = event.resource.id;
      console.log('✅ Payment completed for order:', orderId);

      // Find payment by PayPal order ID
      const payment = await Payment.findOne({ paypalOrderId: orderId });
      if (!payment) {
        console.log('⚠️ Payment record not found for order:', orderId);
        return res.status(200).json({ received: true });
      }

      // Update payment status
      payment.status = 'completed';
      payment.paypalCaptureId = event.resource.id;
      await payment.save();
      console.log('💾 Payment status updated to completed');

      const paymentType = payment.paymentType;

      /* ================= INDIVIDUAL PAYMENT ================= */
      if (paymentType === 'Individual') {
        console.log('👤 Processing Individual subscription...');
        
        // Find user and subscription
        const user = await User.findById(payment.user);
        const subscription = await Subscription.findById(payment.subscription);
        
        if (!user) {
          console.log('⚠️ User not found for ID:', payment.user);
          return res.status(200).json({ received: true });
        }
        
        if (!subscription) {
          console.log('⚠️ Subscription not found for ID:', payment.subscription);
          return res.status(200).json({ received: true });
        }

        // Add user to subscription's totalSubscripeUser array
        if (!subscription.totalSubscripeUser.includes(user._id)) {
          subscription.totalSubscripeUser.push(user._id);
          await subscription.save();
          console.log('📝 User added to subscription list');
        }

        // Calculate expiry date
        const months = subscription.interval === 'yearly' ? 12 : 1;
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + months);

        // Update user subscription info
        user.isSubscription = true;
        user.subscription = subscription._id;
        user.subscriptionExpiry = expiry;
        user.numberOfGame = subscription.numberOfGames || 0; // Default to 0 if null
        await user.save();

        console.log('✅ Individual subscription activated for user:', user.email);
        console.log('📅 Subscription expires on:', expiry.toISOString());

        // Send confirmation email
        const emailBody = `
          <h2>Payment Confirmation</h2>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <p>Thank you for your payment! Your subscription has been activated successfully.</p>
          <p><strong>Subscription:</strong> ${subscription.title}</p>
          <p><strong>Amount:</strong> $${payment.amount}</p>
          <p><strong>Expires:</strong> ${expiry.toLocaleDateString()}</p>
          <p><strong>Number of Games:</strong> ${subscription.numberOfGames || 'Unlimited'}</p>
          <p>Best regards,<br>Your Team</p>
        `;

        try {
          await sendMailer(
            user.email,
            'Subscription Activated',
            emailBody,
          );
          console.log('📧 Confirmation email sent to:', user.email);
        } catch (emailError) {
          console.error('❌ Failed to send email:', emailError);
        }
      }

      /* ================= TEAM GAME PAYMENT ================= */
      else if (paymentType === 'TeamGame') {
        console.log('👥 Processing Team Game subscription...');
        
        // Find team and subscription
        const team = await Team.findById(payment.team);
        const subscription = await Subscription.findById(payment.subscription);
        
        if (!team) {
          console.log('⚠️ Team not found for ID:', payment.team);
          return res.status(200).json({ received: true });
        }
        
        if (!subscription) {
          console.log('⚠️ Subscription not found for ID:', payment.subscription);
          return res.status(200).json({ received: true });
        }

        // Add team to subscription's totalSubscripeTeam array
        if (!subscription.totalSubscripeTeam.includes(team._id)) {
          subscription.totalSubscripeTeam.push(team._id);
          await subscription.save();
          console.log('📝 Team added to subscription list');
        }

        // Update team subscription
        team.subscription = subscription._id;
        await team.save();

        console.log('✅ Team subscription activated for team:', team.teamName);

        /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
        if (team.players && team.players.length > 0) {
          console.log(`👥 Creating ${team.players.length} team player accounts...`);
          
          const userCreationPromises = team.players.map(async (player: any) => {
            // Check if user already exists
            const existingUser = await User.findOne({ email: player.email });
            if (existingUser) {
              console.log(`⏭️ Player already exists: ${player.email}`);
              
              // Update existing user's subscription info
              existingUser.isSubscription = true;
              existingUser.subscription = subscription._id;
              existingUser.team = team._id;
              existingUser.numberOfGame = subscription.numberOfGames || 0;
              await existingUser.save();
              
              return existingUser;
            }

            // Create new user for team player
            const password = Math.random().toString(36).slice(-8);

            const newUser = await User.create({
              firstName: player.name || player.firstName || 'Player',
              lastName: player.lastName || '',
              email: player.email,
              role: player.role || 'player',
              category: team.category,
              league: team.league,
              password: password,
              isSubscription: true,
              subscription: subscription._id,
              numberOfGame: subscription.numberOfGames || 0,
              team: team._id,
              verified: true,
              provider: 'credentials',
            });

            // Send account creation email
            await sendMailer(
              newUser.email,
              'Team Game Subscription - Account Created',
              `
              <h2>Welcome to the Team!</h2>
              <p>Your account has been created for team: ${team.teamName}</p>
              <p><strong>Email:</strong> ${newUser.email}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p>Please login and change your password immediately.</p>
              <p><strong>Subscription:</strong> ${subscription.title}</p>
              <p><strong>Number of Games:</strong> ${subscription.numberOfGames || 'Unlimited'}</p>
              `,
            );

            console.log('✅ Created user for team player:', newUser.email);
            return newUser;
          });

          await Promise.all(userCreationPromises);
          console.log('✅ All team player accounts processed');
        }
      }

      return res.status(200).json({ received: true });
    }

    /* ================= PAYMENT FAILED ================= */
    if (
      event.event_type === 'PAYMENT.CAPTURE.DENIED' ||
      event.event_type === 'CHECKOUT.ORDER.DECLINED'
    ) {
      const orderId = event.resource.id;
      console.log('❌ Payment failed for order:', orderId);

      const payment = await Payment.findOne({
        paypalOrderId: orderId,
      });

      if (payment) {
        payment.status = 'failed';
        await payment.save();
        console.log('✅ Payment status updated to failed');
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Webhook Handler Error:', err.message);
    console.error('Stack:', err.stack);
    return res.status(500).send(`Webhook Handler Error: ${err.message}`);
  }
};

export default webHookHandlers;