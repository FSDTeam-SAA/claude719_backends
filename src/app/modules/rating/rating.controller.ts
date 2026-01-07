import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { ratingService } from './rating.service';

const createRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ratingService.createRating(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rating created successfully',
    data: result,
  });
});

const getAllRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ratingService.getAllRating(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ratings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ratingService.getSingleRating(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rating retrieved successfully',
    data: result,
  });
});

const updateRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ratingService.updateRating(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rating updated successfully',
    data: result,
  });
});

const deleteRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ratingService.deleteRating(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rating deleted successfully',
    data: result,
  });
});

export const ratingController = {
  createRating,
  getAllRating,
  getSingleRating,
  updateRating,
  deleteRating,
};
