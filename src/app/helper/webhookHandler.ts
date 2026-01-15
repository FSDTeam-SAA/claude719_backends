import Stripe from 'stripe';
import config from '../config';
import { Request, Response } from 'express';
import Payment from '../modules/payment/payment.model';
import User from '../modules/user/user.model';
import Subscription from '../modules/subscription/subscription.model';
import Team from '../modules/team/team.model';
import sendMailer from './sendMailer';

const stripe = new Stripe(config.stripe.secretKey!);

const webHookHandlers = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret!,
    );
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    /* ================= CHECKOUT COMPLETED ================= */
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (!payment) return res.status(200).json({ received: true });

      payment.status = 'completed';
      payment.stripePaymentIntentId = session.payment_intent as string;
      await payment.save();

      const paymentType = session.metadata?.paymentType;

      /* ================= INDIVIDUAL ================= */
      if (paymentType === 'Individual') {
        const user = await User.findById(payment.user);
        const subscription = await Subscription.findById(payment.subscription);
        if (!user || !subscription)
          return res.status(200).json({ received: true });

        if (!subscription.totalSubscripeUser.includes(user._id)) {
          subscription.totalSubscripeUser.push(user._id);
          await subscription.save();
        }

        const months = subscription.interval === 'yearly' ? 12 : 1;
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + months);

        user.isSubscription = true;
        user.subscription = subscription._id;
        user.subscriptionExpiry = expiry;
        user.numberOfGame = subscription.numberOfGames ?? undefined;
        await user.save();
      }

      /* ================= TEAM GAME ================= */
      if (paymentType === 'TeamGame') {
        const team = await Team.findById(payment.team);
        const subscription = await Subscription.findById(payment.subscription);
        if (!team || !subscription)
          return res.status(200).json({ received: true });

        if (!subscription.totalSubscripeTeam.includes(team._id)) {
          subscription.totalSubscripeTeam.push(team._id);
          await subscription.save();
        }

        // const months = subscription.interval === 'yearly' ? 12 : 1;
        // const expiry = new Date();
        // expiry.setMonth(expiry.getMonth() + months);

        team.subscription = subscription._id;
        // team.subscriptionExpiry = null;
        await team.save();

        /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
        await Promise.all(
          team.players.map(async (player) => {
            const exists = await User.findOne({ email: player.email });
            if (exists) return;

            const password = Math.random().toString(36).slice(-8);

            const newUser = await User.create({
              firstName: player.name,
              lastName: '',
              email: player.email,
              role: player.role,
              category: team.category,
              league: team.league,
              password,
              isSubscription: true,
              subscription: subscription._id,
              // subscriptionExpiry: expiry,
              numberOfGame: subscription.numberOfGames,
              team: team._id,
            });

            await sendMailer(
              newUser.email,
              'Team Game Subscription',
              `Your password: ${password}\n Email: ${newUser.email}`,
            );
          }),
        );
      }

      return res.status(200).json({ received: true });
    }

    /* ================= PAYMENT FAILED ================= */
    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;

      const payment = await Payment.findOne({
        stripePaymentIntentId: intent.id,
      });

      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Handler Error:', err.message);
    return res.status(500).send(`Webhook Handler Error: ${err.message}`);
  }
};

export default webHookHandlers;
