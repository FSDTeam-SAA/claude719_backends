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

export const SubscriptionService = {
  createSubscription,
  getAllSubscription,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  activeSubscription,
  paySubscription,
  payTeamSubScription,
};
