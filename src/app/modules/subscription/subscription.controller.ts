// import pick from '../../helper/pick';
// import catchAsync from '../../utils/catchAsycn';
// import sendResponse from '../../utils/sendResponse';
// import { SubscriptionService } from './subscription.service';

// const createSubscription = catchAsync(async (req, res) => {
//   const result = await SubscriptionService.createSubscription(req.body);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Subscription created successfully',
//     data: result,
//   });
// });

// const getAllSubscription = catchAsync(async (req, res) => {
//   const filters = pick(req.query, [
//     'searchTerm',
//     'numberOfGames',
//     'interval',
//     'features',
//     'status',
//   ]);

//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   const result = await SubscriptionService.getAllSubscription(filters, options);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscriptions retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getSingleSubscription = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await SubscriptionService.getSingleSubscription(id!);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription retrieved successfully',
//     data: result,
//   });
// });

// const updateSubscription = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await SubscriptionService.updateSubscription(id!, req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription updated successfully',
//     data: result,
//   });
// });
// const deleteSubscription = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await SubscriptionService.deleteSubscription(id!);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription deleted successfully',
//     data: result,
//   });
// });

// const activeSubscription = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await SubscriptionService.activeSubscription(id!);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Subscription active successfully',
//     data: result,
//   });
// });

// // const paySubscription = catchAsync(async (req, res) => {
// //   console.log(req.user?.id, req.params.id!)
// //   const result = await SubscriptionService.paySubscription(
// //     req.user?.id,
// //     req.params.id!,
// //   );

// //   sendResponse(res, {
// //     statusCode: 200,
// //     success: true,
// //     message: 'Subscription paid successfully',
// //     data: result,
// //   });
// // });

// // const payTeamSubScription = catchAsync(async (req, res) => {
// //   // const { teamId } = req.params;
// //   const result = await SubscriptionService.payTeamSubScription(
// //     req.params.teamId!,
// //     req.params.id!,
// //   );

// //   sendResponse(res, {
// //     statusCode: 200,
// //     success: true,
// //     message: 'Subscription paid successfully team',
// //     data: result,
// //   });
// // });

// // =========================================

// // const paySubscriptionPaypal = catchAsync(async (req, res) => {
// //   const result = await SubscriptionService.paySubscriptionPaypal(
// //     req.user!.id,
// //     req.params.id!,
// //   );

// //   sendResponse(res, {
// //     statusCode: 200,
// //     success: true,
// //     message: 'PayPal order created',
// //     data: result,
// //   });
// // });

// // const payTeamSubscriptionPaypal = catchAsync(async (req, res) => {
// //   const result = await SubscriptionService.payTeamSubscriptionPaypal(
// //     req.params.teamId!,
// //     req.params.id!,
// //   );

// //   sendResponse(res, {
// //     statusCode: 200,
// //     success: true,
// //     message: 'PayPal team order created',
// //     data: result,
// //   });
// // });

// // const capturePaypalPayment = catchAsync(async (req, res) => {
// //   const { orderId } = req.body;

// //   const result = await SubscriptionService.capturePaypalPayment(orderId);

// //   sendResponse(res, {
// //     statusCode: 200,
// //     success: true,
// //     message: 'PayPal payment completed',
// //     data: result,
// //   });
// // });

// export const SubscriptionController = {
//   createSubscription,
//   getAllSubscription,
//   getSingleSubscription,
//   updateSubscription,
//   deleteSubscription,
//   activeSubscription,
//   // paySubscription,
//   // payTeamSubScription,

//   // paySubscriptionPaypal,
//   // payTeamSubscriptionPaypal,
//   // capturePaypalPayment,
// };

import { Request, Response } from 'express';
import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.createSubscription(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const getAllSubscription = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'numberOfGames',
    'interval',
    'features',
    'status',
  ]);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await SubscriptionService.getAllSubscription(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.getSingleSubscription(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription retrieved successfully',
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.updateSubscription(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription updated successfully',
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.deleteSubscription(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription deleted successfully',
    data: result,
  });
});

const activeSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.activeSubscription(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription active successfully',
    data: result,
  });
});

const payIndividualSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.payIndividualSubscription(
    req.user?.id,
    id!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription paid successfully',
    data: result,
  });
});

const payTeamSubscription = catchAsync(async (req, res) => {
  const { teamId, id } = req.params;
  const result = await SubscriptionService.payTeamSubscription(teamId!, id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription paid successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getAllSubscription,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
  activeSubscription,
  payIndividualSubscription,
  payTeamSubscription,
};

// // ===================== PAYMENT CONTROLLERS =====================

// const payIndividualSubscription = catchAsync(async (req, res) => {
//   console.log('🎯 payIndividualSubscription controller called');
//   console.log('👤 User ID from request:', req.user?.id);
//   console.log('📦 Subscription ID from params:', req.params.id);

//   const result = await SubscriptionService.payIndividualSubscription(
//     req.user?.id!,
//     req.params.id!,
//   );

//   console.log('✅ Controller returning response');

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'PayPal order created successfully. Please complete payment.',
//     data: result,
//   });
// });

// const payTeamSubscription = catchAsync(async (req, res) => {
//   console.log('🎯 payTeamSubscription controller called');
//   console.log('🏢 Team ID:', req.params.teamId);
//   console.log('📦 Subscription ID:', req.params.id);

//   const result = await SubscriptionService.payTeamSubscription(
//     req.params.teamId!,
//     req.params.id!,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'PayPal team order created successfully. Please complete payment.',
//     data: result,
//   });
// });

// // ===================== PAYMENT SUCCESS HANDLER =====================
// const paymentSuccessHandler = catchAsync(async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { token } = req.query; // PayPal orderId
//     const userId = req.user?.id; // Authenticated user

//     console.log('='.repeat(50));
//     console.log('🔄 PROCESSING PAYMENT SUCCESS');
//     console.log('📦 Order ID:', token);
//     console.log('👤 User ID:', userId);
//     console.log('='.repeat(50));

//     if (!token) {
//       await session.abortTransaction();
//       session.endSession();

//       return sendResponse(res, {
//         statusCode: 400,
//         success: false,
//         message: 'Order token is required',
//       });
//     }

//     // Step 1: Check if payment already completed
//     const existingPayment = await Payment.findOne({
//       paypalOrderId: token,
//     }).session(session);

//     if (existingPayment && existingPayment.status === 'completed') {
//       await session.abortTransaction();
//       session.endSession();

//       console.log('ℹ️ Payment already completed, returning success');

//       return sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Payment already completed',
//         data: {
//           paymentId: existingPayment._id,
//           status: 'already_completed',
//         },
//       });
//     }

//     // Step 2: Capture payment from PayPal
//     console.log('💰 Capturing payment from PayPal...');
//     const captureResult = await capturePaypalOrder(token as string);

//     if (!captureResult.success) {
//       await session.abortTransaction();
//       session.endSession();

//       console.error('❌ PayPal capture failed');

//       return sendResponse(res, {
//         statusCode: 400,
//         success: false,
//         message: 'Failed to capture payment from PayPal',
//         data: captureResult.error,
//       });
//     }

//     console.log('✅ PayPal capture successful');

//     // Step 3: Find payment record
//     const payment = await Payment.findOne({
//       paypalOrderId: token,
//     }).session(session);

//     if (!payment) {
//       await session.abortTransaction();
//       session.endSession();

//       console.error('❌ Payment record not found in database');

//       return sendResponse(res, {
//         statusCode: 404,
//         success: false,
//         message: 'Payment record not found',
//         data: captureResult.captureId,
//       });
//     }

//     console.log('📄 Found payment record:', payment._id);
//     console.log('💳 Payment Type:', payment.paymentType);
//     console.log('👤 Payment User:', payment.user);
//     console.log('🏢 Payment Team:', payment.team);

//     // Step 4: Update payment status
//     payment.status = 'completed';
//     payment.paypalCaptureId = captureResult.captureId || token;
//     payment.updatedAt = new Date();
//     await payment.save({ session });

//     console.log('✅ Payment status updated to completed');

//     const paymentType = payment.paymentType;

//     /* ================= INDIVIDUAL PAYMENT ================= */
//     if (paymentType === 'Individual') {
//       console.log('👤 Processing INDIVIDUAL subscription...');

//       const user = await User.findById(payment.user).session(session);
//       const subscription = await subscriptionModel
//         .findById(payment.subscription)
//         .session(session);

//       if (!user) {
//         console.error('❌ User not found:', payment.user);
//         await session.abortTransaction();
//         session.endSession();

//         return sendResponse(res, {
//           statusCode: 404,
//           success: false,
//           message: 'User not found',
//           data: payment._id,
//         });
//       }

//       if (!subscription) {
//         console.error('❌ Subscription not found:', payment.subscription);
//         await session.abortTransaction();
//         session.endSession();

//         return sendResponse(res, {
//           statusCode: 404,
//           success: false,
//           message: 'Subscription not found',
//           data: payment._id,
//         });
//       }

//       console.log('✅ Found user:', user.email);
//       console.log('✅ Found subscription:', subscription.title);

//       // Add user to subscription's totalSubscripeUser array
//       if (!subscription.totalSubscripeUser.includes(user._id)) {
//         subscription.totalSubscripeUser.push(user._id);
//         await subscription.save({ session });
//         console.log('📝 User added to subscription list');
//       }

//       // Calculate expiry date
//       const months = subscription.interval === 'yearly' ? 12 : 1;
//       const expiry = new Date();
//       expiry.setMonth(expiry.getMonth() + months);

//       console.log('📅 Subscription expiry:', expiry.toISOString());

//       // Update user subscription info
//       user.isSubscription = true;
//       user.subscription = subscription._id;
//       user.subscriptionExpiry = expiry;
//       user.numberOfGame = subscription.numberOfGames || 0;
//       user.updatedAt = new Date();
//       await user.save({ session });

//       console.log('✅ User subscription activated');
//       console.log('👤 isSubscription:', user.isSubscription);
//       console.log('📦 subscriptionId:', user.subscription);
//       console.log('📅 expiry:', user.subscriptionExpiry);
//       console.log('🎮 numberOfGame:', user.numberOfGame);

//       // Send confirmation email
//       const emailBody = `
//         <h2>🎉 Payment Confirmation</h2>
//         <p>Dear ${user.firstName} ${user.lastName},</p>
//         <p>Thank you for your payment! Your subscription has been activated successfully.</p>
//         <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
//           <p><strong>Order ID:</strong> ${token}</p>
//           <p><strong>Subscription:</strong> ${subscription.title}</p>
//           <p><strong>Amount:</strong> $${payment.amount}</p>
//           <p><strong>Expires:</strong> ${expiry.toLocaleDateString()}</p>
//           <p><strong>Number of Games:</strong> ${subscription.numberOfGames || 'Unlimited'}</p>
//         </div>
//         <p>You can now access all premium features.</p>
//         <p>Best regards,<br>Your Team</p>
//       `;

//       try {
//         await sendMailer(
//           user.email,
//           '✅ Subscription Activated Successfully',
//           emailBody,
//         );
//         console.log('📧 Confirmation email sent to:', user.email);
//       } catch (emailError) {
//         console.error('❌ Failed to send email:', emailError);
//         // Email failure shouldn't stop the process
//       }

//       await session.commitTransaction();
//       session.endSession();

//       console.log('='.repeat(50));
//       console.log('✅ TRANSACTION COMPLETED SUCCESSFULLY');
//       console.log('='.repeat(50));

//       return sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Payment completed and subscription activated',
//         data: {
//           paymentId: payment._id,
//           userId: user._id,
//           userEmail: user.email,
//           subscription: subscription.title,
//           expiryDate: expiry,
//           amount: payment.amount,
//           paypalOrderId: token,
//           paypalCaptureId: captureResult.captureId,
//         },
//       });
//     } else if (paymentType === 'TeamGame') {

//     /* ================= TEAM PAYMENT ================= */
//       console.log('👥 Processing TEAM subscription...');

//       const team = await Team.findById(payment.team).session(session);
//       const subscription = await subscriptionModel
//         .findById(payment.subscription)
//         .session(session);

//       if (!team) {
//         console.error('❌ Team not found:', payment.team);
//         await session.abortTransaction();
//         session.endSession();

//         return sendResponse(res, {
//           statusCode: 404,
//           success: false,
//           message: 'Team not found',
//           data: payment._id,
//         });
//       }

//       if (!subscription) {
//         console.error('❌ Subscription not found:', payment.subscription);
//         await session.abortTransaction();
//         session.endSession();

//         return sendResponse(res, {
//           statusCode: 404,
//           success: false,
//           message: 'Subscription not found',
//           data: payment._id,
//         });
//       }

//       console.log('✅ Found team:', team.teamName);
//       console.log('✅ Found subscription:', subscription.title);

//       // Add team to subscription's totalSubscripeTeam array
//       if (!subscription.totalSubscripeTeam.includes(team._id)) {
//         subscription.totalSubscripeTeam.push(team._id);
//         await subscription.save({ session });
//         console.log('📝 Team added to subscription list');
//       }

//       // Update team subscription
//       team.subscription = subscription._id;
//       team.updatedAt = new Date();
//       await team.save({ session });

//       console.log('✅ Team subscription activated');

//       /* ===== CREATE USERS FOR TEAM PLAYERS ===== */
//       if (team.players && team.players.length > 0) {
//         console.log(
//           `👥 Creating ${team.players.length} team player accounts...`,
//         );

//         const userPromises = team.players.map(async (player: any) => {
//           const existingUser = await User.findOne({
//             email: player.email,
//           }).session(session);

//           if (existingUser) {
//             console.log(`⏭️ Player already exists: ${player.email}`);

//             // Update existing user
//             existingUser.isSubscription = true;
//             existingUser.subscription = subscription._id;
//             existingUser.team = team._id;
//             existingUser.numberOfGame = subscription.numberOfGames || 0;
//             existingUser.updatedAt = new Date();
//             await existingUser.save({ session });

//             return existingUser;
//           }

//           // Create new user
//           const password = Math.random().toString(36).slice(-8);

//           const newUser = await User.create(
//             [
//               {
//                 firstName: player.name || player.firstName || 'Player',
//                 lastName: player.lastName || '',
//                 email: player.email,
//                 role: player.role || 'player',
//                 category: team.category,
//                 league: team.league,
//                 password: password,
//                 isSubscription: true,
//                 subscription: subscription._id,
//                 numberOfGame: subscription.numberOfGames || 0,
//                 team: team._id,
//                 verified: true,
//                 provider: 'credentials',
//               },
//             ],
//             { session },
//           );

//           console.log('✅ Created user for team player:', player.email);
//           return newUser[0];
//         });

//         await Promise.all(userPromises);
//         console.log('✅ All team players processed');
//       }

//       await session.commitTransaction();
//       session.endSession();

//       return sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Team payment completed and subscription activated',
//         data: {
//           paymentId: payment._id,
//           teamId: team._id,
//           teamName: team.teamName,
//           subscription: subscription.title,
//           amount: payment.amount,
//           paypalOrderId: token,
//         },
//       });
//     }

//     // If payment type not recognized
//     await session.commitTransaction();
//     session.endSession();

//     return sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Payment captured successfully',
//       data: {
//         paymentId: payment._id,
//         status: 'completed',
//       },
//     });
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error('❌ Payment success handler ERROR:');
//     console.error('Message:', error.message);
//     console.error('Stack:', error.stack);

//     return sendResponse(res, {
//       statusCode: 500,
//       success: false,
//       message: 'Internal server error while processing payment',
//       // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// });

// // ===================== PAYMENT STATUS CHECKER =====================
// const paymentStatusChecker = catchAsync(async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     console.log('🔍 Checking payment status for:', orderId);

//     // Check database
//     const payment = await Payment.findOne({ paypalOrderId: orderId });

//     // Check PayPal
//     const paypalStatus = await getOrderDetails(orderId!);

//     return sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Payment status retrieved successfully',
//       data: {
//         paypalOrderId: orderId,
//         paypalStatus: paypalStatus.success ? paypalStatus.data.status : 'ERROR',
//         dbStatus: payment ? payment.status : 'NOT_FOUND',
//         paymentId: payment?._id,
//         amount: payment?.amount,
//         paymentType: payment?.paymentType,
//         user: payment?.user,
//         team: payment?.team,
//         subscription: payment?.subscription,
//         createdAt: payment?.createdAt,
//         updatedAt: payment?.updatedAt,
//       },
//     });
//   } catch (error: any) {
//     console.error('❌ Check payment status error:', error);
//     return sendResponse(res, {
//       statusCode: 500,
//       success: false,
//       message: 'Failed to check payment status',
//       // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// });

// // ===================== MANUAL PAYMENT VERIFICATION =====================
// const manualPaymentVerification = catchAsync(async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     if (!orderId) {
//       return sendResponse(res, {
//         statusCode: 400,
//         success: false,
//         message: 'Order ID is required',
//       });
//     }

//     console.log('🔄 Manual verification for order:', orderId);

//     // Step 1: Check PayPal
//     const paypalResult = await getOrderDetails(orderId);

//     if (!paypalResult.success) {
//       return sendResponse(res, {
//         statusCode: 400,
//         success: false,
//         message: 'PayPal order not found',
//         // error: paypalResult.error,
//       });
//     }

//     // Step 2: Find payment in database
//     const payment = await Payment.findOne({ paypalOrderId: orderId });

//     if (!payment) {
//       return sendResponse(res, {
//         statusCode: 404,
//         success: false,
//         message: 'Payment record not found in database',
//         // paypalStatus: paypalResult.data.status,
//       });
//     }

//     // Step 3: Update based on PayPal status
//     let updated = false;
//     let message = 'Payment status check complete';

//     if (
//       paypalResult.data.status === 'COMPLETED' &&
//       payment.status === 'pending'
//     ) {
//       payment.status = 'completed';
//       payment.paypalCaptureId = paypalResult.data.id;
//       payment.updatedAt = new Date();
//       await payment.save();

//       updated = true;
//       message = 'Payment updated to completed based on PayPal status';
//     }

//     return sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: message,
//       data: {
//         paymentId: payment._id,
//         dbStatus: payment.status,
//         paypalStatus: paypalResult.data.status,
//         updated: updated,
//         needsUpdate:
//           paypalResult.data.status === 'COMPLETED' &&
//           payment.status === 'pending',
//       },
//     });
//   } catch (error: any) {
//     console.error('❌ Manual verification error:', error);
//     return sendResponse(res, {
//       statusCode: 500,
//       success: false,
//       message: 'Manual verification failed',
//       // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// });

// export const SubscriptionController = {
//   createSubscription,
//   getAllSubscription,
//   getSingleSubscription,
//   updateSubscription,
//   deleteSubscription,
//   activeSubscription,
//   payIndividualSubscription,
//   payTeamSubscription,
//   // paymentSuccessHandler,
//   // paymentStatusChecker,
//   // manualPaymentVerification,
// };
