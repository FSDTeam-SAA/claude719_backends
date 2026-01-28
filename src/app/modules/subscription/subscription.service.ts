import Stripe from 'stripe';
import config from '../../config';
import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { ISubscription } from './subscription.interface';
import Subscription from './subscription.model';
import User from '../user/user.model';
import Payment from '../payment/payment.model';
import Team from '../team/team.model';
import sendMailer from '../../helper/sendMailer';
import {
  capturePaypalOrder,
  createPaypalOrder,
} from '../../helper/paypalService';

const stripe = new Stripe(config.stripe.secretKey!);

const createSubscription = async (payload: ISubscription) => {
  // const subscription = await Subscription.findOne({ name: payload.numberOfGames });
  // if (subscription) throw new AppError(400, 'Subscription already exists');

  const result = await Subscription.create(payload);
  if (!result) throw new AppError(400, 'Failed to create Subscription');

  return result;
};

const getAllSubscription = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, year, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'numberOfGames',
    'interval',
    'features',
    'status',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // YEAR Filter → createdAt
  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    andCondition.push({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Subscription.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  if (!result) {
    throw new AppError(404, 'Subscription not found');
  }

  const total = await Subscription.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleSubscription = async (id: string) => {
  const result = await Subscription.findById(id);
  if (!result) throw new AppError(400, 'Failed to get single Subscription');

  return result;
};

const updateSubscription = async (id: string, payload: ISubscription) => {
  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(400, 'Failed to update Subscription');

  return result;
};

const deleteSubscription = async (id: string) => {
  const result = await Subscription.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Failed to delete Subscription');

  return result;
};

const activeSubscription = async (id: string) => {
  await Subscription.updateMany({}, { status: 'inactive' });
  const result = await Subscription.findByIdAndUpdate(
    id,
    { status: 'active' },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to activate Subscription');
  }

  return result;
};

const paySubscription = async (userId: string, subscriptionId: string) => {
  console.log('hello world', userId, subscriptionId);
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(404, 'Subscription not found');

  const sessionParams: any = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(subscription.price! * 100),
          product_data: {
            name: `${subscription.title}`,
            description: subscription.interval,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${config.frontendUrl}/success`,
    cancel_url: `${config.frontendUrl}/cancel`,
    metadata: {
      userId: user._id.toString(),
      subscriptionId: subscription._id.toString(),
      paymentType: subscription.paymentType,
    },
  };

  if (user.email) {
    sessionParams.customer_email = user.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  await Payment.create({
    user: user._id,
    subscription: subscription._id,
    stripeSessionId: session.id,
    amount: subscription.price,
    currency: 'usd',
    paymentType: subscription.paymentType,
    status: 'pending',
  });

  return { url: session.url };
};

const payTeamSubScription = async (teamId: string, subscriptionId: string) => {
  const team = await Team.findById(teamId);
  if (!team) throw new AppError(404, 'Team not found');

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(404, 'Subscription not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(subscription.price! * 100),
          product_data: {
            name: `${subscription.title}`,
            description: subscription.description || 'discription',
          },
        },
        quantity: 1,
      },
    ],
    customer_email: team.coachEmail!,
    success_url: `${config.frontendUrl}/success`,
    cancel_url: `${config.frontendUrl}/cancel`,
    metadata: {
      teamId: team._id.toString(),
      subscriptionId: subscription._id.toString(),
      paymentType: subscription.paymentType,
    },
  });

  await Payment.create({
    team: team._id,
    user: team._id, // required by model
    subscription: subscription._id,
    stripeSessionId: session.id,
    amount: subscription.price,
    currency: 'usd',
    paymentType: subscription.paymentType,
    status: 'pending',
  });

  return { url: session.url };
};

// =====================================================

// const paySubscriptionPaypal = async (
//   userId: string,
//   subscriptionId: string,
// ) => {
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   const order = await createPaypalOrder(subscription.price!, {
//     userId,
//     subscriptionId,
//     paymentType: 'Individual',
//   });

//   await Payment.create({
//     user: user._id,
//     subscription: subscription._id,
//     amount: subscription.price,
//     currency: 'usd',
//     paymentType: 'Individual',
//     status: 'pending',
//     stripeSessionId: order.id, // reused field
//   });

//   return {
//     orderId: order.id,
//     approveUrl: order.links.find((l: any) => l.rel === 'approve')?.href,
//   };
// };

// const payTeamSubscriptionPaypal = async (
//   teamId: string,
//   subscriptionId: string,
// ) => {
//   const team = await Team.findById(teamId);
//   if (!team) throw new AppError(404, 'Team not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   const order = await createPaypalOrder(subscription.price!, {
//     teamId,
//     subscriptionId,
//     paymentType: 'TeamGame',
//   });

//   await Payment.create({
//     team: team._id,
//     user: team._id,
//     subscription: subscription._id,
//     amount: subscription.price,
//     currency: 'usd',
//     paymentType: 'TeamGame',
//     status: 'pending',
//     stripeSessionId: order.id,
//   });

//   return {
//     orderId: order.id,
//     approveUrl: order.links.find((l: any) => l.rel === 'approve')?.href,
//   };
// };

// const capturePaypalPayment = async (orderId: string) => {
//   const capture = await capturePaypalOrder(orderId);

//   if (capture.status !== 'COMPLETED') {
//     throw new AppError(400, 'Payment not completed');
//   }

//   const payment = await Payment.findOne({ stripeSessionId: orderId });
//   if (!payment) throw new AppError(404, 'Payment record not found');

//   payment.status = 'completed';
//   await payment.save();

//   const subscription = await Subscription.findById(payment.subscription);

//   /* ========== INDIVIDUAL ========== */
//   if (payment.paymentType === 'Individual') {
//     const user = await User.findById(payment.user);
//     if (!user || !subscription) return;

//     const months = subscription.interval === 'yearly' ? 12 : 1;
//     const expiry = new Date();
//     expiry.setMonth(expiry.getMonth() + months);

//     user.isSubscription = true;
//     user.subscription = subscription._id;
//     user.subscriptionExpiry = expiry;
//     user.numberOfGame = subscription.numberOfGames ?? undefined;
//     await user.save();
//   }

//   /* ========== TEAM GAME ========== */
//   if (payment.paymentType === 'TeamGame') {
//     const team = await Team.findById(payment.team);
//     if (!team || !subscription) return;

//     team.subscription = subscription._id;
//     await team.save();
//   }

//   return { success: true };
// };

export const SubscriptionService = {
  createSubscription,
  getAllSubscription,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  activeSubscription,
  paySubscription,
  payTeamSubScription,

  // paySubscriptionPaypal,
  // payTeamSubscriptionPaypal,
  // capturePaypalPayment,
};
