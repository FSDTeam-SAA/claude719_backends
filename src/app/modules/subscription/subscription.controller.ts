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
