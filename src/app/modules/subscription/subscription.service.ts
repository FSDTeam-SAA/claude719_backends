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

// const paySubscription = async (userId: string, subscriptionId: string) => {
//   console.log('hello world', userId, subscriptionId);
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   const sessionParams: any = {
//     mode: 'payment',
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           unit_amount: Math.round(subscription.price! * 100),
//           product_data: {
//             name: `${subscription.title}`,
//             description: subscription.interval,
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${config.frontendUrl}/success`,
//     cancel_url: `${config.frontendUrl}/cancel`,
//     metadata: {
//       userId: user._id.toString(),
//       subscriptionId: subscription._id.toString(),
//       paymentType: subscription.paymentType,
//     },
//   };

//   if (user.email) {
//     sessionParams.customer_email = user.email;
//   }

//   const session = await stripe.checkout.sessions.create(sessionParams);

//   await Payment.create({
//     user: user._id,
//     subscription: subscription._id,
//     stripeSessionId: session.id,
//     amount: subscription.price,
//     currency: 'usd',
//     paymentType: subscription.paymentType,
//     status: 'pending',
//   });

//   return { url: session.url };
// };

// const payTeamSubScription = async (teamId: string, subscriptionId: string) => {
//   const team = await Team.findById(teamId);
//   if (!team) throw new AppError(404, 'Team not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   const session = await stripe.checkout.sessions.create({
//     mode: 'payment',
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           unit_amount: Math.round(subscription.price! * 100),
//           product_data: {
//             name: `${subscription.title}`,
//             description: subscription.description || 'discription',
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     customer_email: team.coachEmail!,
//     success_url: `${config.frontendUrl}/success`,
//     cancel_url: `${config.frontendUrl}/cancel`,
//     metadata: {
//       teamId: team._id.toString(),
//       subscriptionId: subscription._id.toString(),
//       paymentType: subscription.paymentType,
//     },
//   });

//   await Payment.create({
//     team: team._id,
//     user: team._id, // required by model
//     subscription: subscription._id,
//     stripeSessionId: session.id,
//     amount: subscription.price,
//     currency: 'usd',
//     paymentType: subscription.paymentType,
//     status: 'pending',
//   });

//   return { url: session.url };
// };

// ===================================================== update paypal ==========================================

// import axios from 'axios';

// const PAYPAL_API_BASE =
//   config.env === 'production'
//     ? 'https://api-m.paypal.com'
//     : 'https://api-m.sandbox.paypal.com';

// const getPayPalAccessToken = async () => {
//   try {
//     const auth = Buffer.from(
//       `${config.paypal.clientId}:${config.paypal.clientSecret}`,
//     ).toString('base64');

//     console.log('🔑 Attempting PayPal authentication...');
//     console.log('📍 Environment:', config.env);
//     console.log('🌐 API Base:', PAYPAL_API_BASE);

//     const response = await axios.post(
//       `${PAYPAL_API_BASE}/v1/oauth2/token`,
//       'grant_type=client_credentials',
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );

//     console.log('✅ PayPal authentication successful');
//     return response.data.access_token;
//   } catch (error: any) {
//     console.error('❌ PayPal Auth Error Details:');
//     console.error('Status:', error.response?.status);
//     console.error('Error:', error.response?.data);
//     console.error('Message:', error.message);

//     throw new AppError(
//       500,
//       `PayPal authentication failed: ${error.response?.data?.error_description || error.message}`,
//     );
//   }
// };

// const payIndividualSubscription = async (
//   userId: string,
//   subscriptionId: string,
// ) => {
//   console.log(
//     '💳 Processing individual payment for user:',
//     userId,
//     'subscription:',
//     subscriptionId,
//   );

//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   if (subscription.paymentType !== 'Individual') {
//     throw new AppError(
//       400,
//       'This subscription is not for individual users. Please use team subscription endpoint.',
//     );
//   }

//   const accessToken = await getPayPalAccessToken();

//   const orderData = {
//     intent: 'CAPTURE',
//     purchase_units: [
//       {
//         amount: {
//           currency_code: 'USD',
//           value: subscription.price!.toFixed(2),
//         },
//         description: `${subscription.title} - ${subscription.interval}`,
//       },
//     ],
//     application_context: {
//       return_url: `${config.frontendUrl}/payment/success`,
//       cancel_url: `${config.frontendUrl}/payment/cancel`,
//       user_action: 'PAY_NOW',
//       brand_name: 'Your App Name',
//       landing_page: 'BILLING',
//     },
//   };

//   try {
//     const response = await axios.post(
//       `${PAYPAL_API_BASE}/v2/checkout/orders`,
//       orderData,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     const order = response.data;
//     console.log('✅ PayPal individual order created:', order.id);

//     // Create payment record
//     await Payment.create({
//       user: user._id,
//       subscription: subscription._id,
//       paypalOrderId: order.id,
//       amount: subscription.price,
//       currency: 'usd',
//       paymentType: subscription.paymentType,
//       status: 'pending',
//     });

//     const approvalUrl = order.links.find(
//       (link: any) => link.rel === 'approve',
//     )?.href;

//     if (!approvalUrl) {
//       throw new AppError(500, 'PayPal approval URL not found');
//     }

//     return {
//       orderId: order.id,
//       url: approvalUrl,
//       amount: subscription.price,
//       subscriptionTitle: subscription.title,
//     };
//   } catch (error: any) {
//     console.error('❌ PayPal Individual Order Creation Error:');
//     console.error('Status:', error.response?.status);
//     console.error('Error:', error.response?.data);

//     throw new AppError(
//       500,
//       `PayPal order creation failed: ${error.response?.data?.message || error.message}`,
//     );
//   }
// };

// // const payTeamSubscription = async (teamId: string, subscriptionId: string) => {
// //   console.log(
// //     '💳 Processing team payment for team:',
// //     teamId,
// //     'subscription:',
// //     subscriptionId,
// //   );

// //   const team = await Team.findById(teamId);
// //   if (!team) throw new AppError(404, 'Team not found');

// //   const subscription = await Subscription.findById(subscriptionId);
// //   if (!subscription) throw new AppError(404, 'Subscription not found');

// //   if (subscription.paymentType !== 'TeamGame') {
// //     throw new AppError(
// //       400,
// //       'This subscription is not for teams. Please use individual subscription endpoint.',
// //     );
// //   }

// //   const accessToken = await getPayPalAccessToken();

// //   const orderData = {
// //     intent: 'CAPTURE',
// //     purchase_units: [
// //       {
// //         amount: {
// //           currency_code: 'USD',
// //           value: subscription.price!.toFixed(2),
// //         },
// //         description: `${subscription.title} - ${subscription.description || 'Team Subscription'}`,
// //       },
// //     ],
// //     application_context: {
// //       return_url: `${config.frontendUrl}/payment/success`,
// //       cancel_url: `${config.frontendUrl}/payment/cancel`,
// //       user_action: 'PAY_NOW',
// //       brand_name: 'Your App Name',
// //       landing_page: 'BILLING',
// //     },
// //   };

// //   try {
// //     const response = await axios.post(
// //       `${PAYPAL_API_BASE}/v2/checkout/orders`,
// //       orderData,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //           'Content-Type': 'application/json',
// //         },
// //       },
// //     );

// //     const order = response.data;
// //     console.log('✅ PayPal team order created:', order.id);

// //     // Create payment record
// //     await Payment.create({
// //       team: team._id,
// //       user: team._id, // required by model
// //       subscription: subscription._id,
// //       paypalOrderId: order.id,
// //       amount: subscription.price,
// //       currency: 'usd',
// //       paymentType: subscription.paymentType,
// //       status: 'pending',
// //     });

// //     const approvalUrl = order.links.find(
// //       (link: any) => link.rel === 'approve',
// //     )?.href;

// //     if (!approvalUrl) {
// //       throw new AppError(500, 'PayPal approval URL not found');
// //     }

// //     return {
// //       orderId: order.id,
// //       url: approvalUrl,
// //       amount: subscription.price,
// //       subscriptionTitle: subscription.title,
// //       teamName: team.teamName,
// //     };
// //   } catch (error: any) {
// //     console.error('❌ PayPal Team Order Creation Error:');
// //     console.error('Status:', error.response?.status);
// //     console.error('Error:', error.response?.data);

// //     throw new AppError(
// //       500,
// //       `PayPal team order creation failed: ${error.response?.data?.message || error.message}`,
// //     );
// //   }
// // };

// // subscription.service.ts (payTeamSubscription function)

// //=================================update code ==========================================
// const payTeamSubscription = async (teamId: string, subscriptionId: string) => {
//   console.log(
//     '💳 Processing team payment for team:',
//     teamId,
//     'subscription:',
//     subscriptionId,
//   );

//   const team = await Team.findById(teamId);
//   if (!team) throw new AppError(404, 'Team not found');

//   const subscription = await Subscription.findById(subscriptionId);
//   if (!subscription) throw new AppError(404, 'Subscription not found');

//   if (subscription.paymentType !== 'TeamGame') {
//     throw new AppError(
//       400,
//       'This subscription is not for teams. Please use individual subscription endpoint.',
//     );
//   }

//   const accessToken = await getPayPalAccessToken();

//   const orderData = {
//     intent: 'CAPTURE',
//     purchase_units: [
//       {
//         amount: {
//           currency_code: 'USD',
//           value: subscription.price!.toFixed(2),
//         },
//         description: `${subscription.title} - ${subscription.description || 'Team Subscription'}`,
//       },
//     ],
//     application_context: {
//       return_url: `${config.frontendUrl}/payment/success`,
//       cancel_url: `${config.frontendUrl}/payment/cancel`,
//       user_action: 'PAY_NOW',
//       brand_name: 'Your App Name',
//       landing_page: 'BILLING',
//     },
//   };

//   try {
//     const response = await axios.post(
//       `${PAYPAL_API_BASE}/v2/checkout/orders`,
//       orderData,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     const order = response.data;
//     console.log('✅ PayPal team order created:', order.id);

//     // FIXED: For TeamGame, user should be null or a valid user ID (not team ID)
//     // Find the user who is making the payment (coach or team admin)
//     const payingUser = await User.findOne({ team: teamId, role: 'coach' }) ||
//                       await User.findOne({ team: teamId });

//     // Create payment record
//     await Payment.create({
//       team: team._id,
//       user: payingUser ? payingUser._id : team._id, // Use actual user ID or team ID as fallback
//       subscription: subscription._id,
//       paypalOrderId: order.id,
//       amount: subscription.price,
//       currency: 'usd',
//       paymentType: subscription.paymentType,
//       status: 'pending',
//     });

//     const approvalUrl = order.links.find(
//       (link: any) => link.rel === 'approve',
//     )?.href;

//     if (!approvalUrl) {
//       throw new AppError(500, 'PayPal approval URL not found');
//     }

//     return {
//       orderId: order.id,
//       url: approvalUrl,
//       amount: subscription.price,
//       subscriptionTitle: subscription.title,
//       teamName: team.teamName,
//     };
//   } catch (error: any) {
//     console.error('❌ PayPal Team Order Creation Error:');
//     console.error('Status:', error.response?.status);
//     console.error('Error:', error.response?.data);

//     throw new AppError(
//       500,
//       `PayPal team order creation failed: ${error.response?.data?.message || error.message}`,
//     );
//   }
// };

//===========================final code =============================================================


import axios from 'axios';

const PAYPAL_API_BASE =
  config.env === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';


const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${config.paypal.clientId}:${config.paypal.clientSecret}`,
    ).toString('base64');

    console.log('🔑 Attempting PayPal authentication...');
    console.log('📍 Environment:', config.env);
    console.log('🌐 API Base:', PAYPAL_API_BASE);

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    console.log('✅ PayPal authentication successful');
    return response.data.access_token;
  } catch (error: any) {
    console.error('❌ PayPal Auth Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data);
    console.error('Message:', error.message);

    throw new AppError(
      500,
      `PayPal authentication failed: ${error.response?.data?.error_description || error.message}`,
    );
  }
};

const payIndividualSubscription = async (
  userId: string,
  subscriptionId: string,
) => {
  console.log('💳 Processing INDIVIDUAL payment');
  console.log('👤 User ID:', userId);
  console.log('📦 Subscription ID:', subscriptionId);

  // Validate user
  const user = await User.findById(userId);
  if (!user) {
    console.error('❌ User not found:', userId);
    throw new AppError(404, 'User not found');
  }

  console.log('✅ User found:', user.email);

  // Validate subscription
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    console.error('❌ Subscription not found:', subscriptionId);
    throw new AppError(404, 'Subscription not found');
  }

  console.log('✅ Subscription found:', subscription.title);
  console.log('💰 Price:', subscription.price);
  console.log('📅 Interval:', subscription.interval);

  if (subscription.paymentType !== 'Individual') {
    throw new AppError(400, 'This subscription is for individual users only');
  }

  // Get PayPal access token
  const accessToken = await getPayPalAccessToken();

  // Create PayPal order
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: subscription.price!.toFixed(2),
        },
        description: `${subscription.title} - ${subscription.interval} subscription`,
        custom_id: userId,
        invoice_id: `INV-${Date.now()}-${userId.substring(0, 8)}`,
      },
    ],
    application_context: {
      return_url: `${config.frontendUrl}/payment/success?source=paypal`,
      cancel_url: `${config.frontendUrl}/payment/cancel`,
      user_action: 'PAY_NOW',
      brand_name: 'Sports Platform',
      landing_page: 'BILLING',
      shipping_preference: 'NO_SHIPPING',
    },
  };

  console.log('📤 Creating PayPal order...');
  console.log('Order Data:', JSON.stringify(orderData, null, 2));

  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `req-${Date.now()}`,
        },
      },
    );

    const order = response.data;
    console.log('✅ PayPal order created successfully');
    console.log('🎫 Order ID:', order.id);
    console.log('📊 Order Status:', order.status);

    // Find approval URL
    const approvalUrl = order.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      console.error('❌ No approval URL found in response');
      console.log('Order Links:', order.links);
      throw new AppError(500, 'PayPal approval URL not found');
    }

    console.log('🔗 Approval URL:', approvalUrl);

    // Create payment record
    const payment = await Payment.create({
      user: user._id,
      subscription: subscription._id,
      paypalOrderId: order.id,
      amount: subscription.price,
      currency: 'USD',
      paymentType: 'Individual',
      status: 'pending',
    });

    console.log('💾 Payment record created:', payment._id);

    return {
      orderId: order.id,
      url: approvalUrl,
      amount: subscription.price,
      subscriptionTitle: subscription.title,
      paymentId: payment._id,
      userEmail: user.email,
    };
  } catch (error: any) {
    console.error('❌ PayPal Order Creation FAILED:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);

    throw new AppError(
      500,
      `PayPal order creation failed: ${error.response?.data?.message || error.message}`,
    );
  }
};

const payTeamSubscription = async (teamId: string, subscriptionId: string) => {
  console.log('💳 Processing TEAM payment');
  console.log('🏢 Team ID:', teamId);
  console.log('📦 Subscription ID:', subscriptionId);

  const team = await Team.findById(teamId);
  if (!team) throw new AppError(404, 'Team not found');

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(404, 'Subscription not found');

  if (subscription.paymentType !== 'TeamGame') {
    throw new AppError(400, 'This subscription is for teams only');
  }

  // Get the user making the payment (coach or team admin)
  const payingUser =
    (await User.findOne({ team: teamId, role: 'coach' })) ||
    (await User.findOne({ team: teamId }));

  const accessToken = await getPayPalAccessToken();

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: subscription.price!.toFixed(2),
        },
        description: `${subscription.title} - Team: ${team.teamName}`,
        custom_id: teamId,
        invoice_id: `TEAM-${Date.now()}-${teamId.substring(0, 8)}`,
      },
    ],
    application_context: {
      return_url: `${config.frontendUrl}/payment/success?source=paypal&type=team`,
      cancel_url: `${config.frontendUrl}/payment/cancel`,
      user_action: 'PAY_NOW',
      brand_name: 'Sports Platform',
      landing_page: 'BILLING',
    },
  };

  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const order = response.data;
    console.log('✅ PayPal team order created:', order.id);

    // Create payment record
    await Payment.create({
      team: team._id,
      user: payingUser ? payingUser._id : team._id,
      subscription: subscription._id,
      paypalOrderId: order.id,
      amount: subscription.price,
      currency: 'USD',
      paymentType: 'TeamGame',
      status: 'pending',
    });

    const approvalUrl = order.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      throw new AppError(500, 'PayPal approval URL not found');
    }

    return {
      orderId: order.id,
      url: approvalUrl,
      amount: subscription.price,
      subscriptionTitle: subscription.title,
      teamName: team.teamName,
    };
  } catch (error: any) {
    console.error('❌ PayPal Team Order Creation Error:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data);
    console.error('Message:', error.message);

    throw new AppError(
      500,
      `PayPal team order creation failed: ${error.response?.data?.message || error.message}`,
    );
  }
};

export const SubscriptionService = {
  createSubscription,
  getAllSubscription,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  activeSubscription,

  payIndividualSubscription,
  payTeamSubscription,

  // payIndividualSubscription,
  // payTeamSubscription,

  // paySubscriptionPaypal,
  // payTeamSubscriptionPaypal,
  // capturePaypalPayment,
};
