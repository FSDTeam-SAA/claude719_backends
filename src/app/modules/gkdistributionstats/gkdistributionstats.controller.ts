import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { gkDistributionstatsService } from './gkdistributionstats.service';

const createGkDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await gkDistributionstatsService.createGkDistributionstats(
    id!,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'gk distributionstats created successfully',
    data: result,
  });
});

const getAllGkDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await gkDistributionstatsService.getAllGkDistributionstats(
    id!,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'gk distributionstats retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGkDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await gkDistributionstatsService.getSingleGkDistributionstats(
    id!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'gk distributionstats retrieved successfully',
    data: result,
  });
});
const updateGkDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await gkDistributionstatsService.updateGkDistributionstats(
    id!,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'gk distributionstats updated successfully',
    data: result,
  });
});
const deleteGkDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await gkDistributionstatsService.deleteGkDistributionstats(
    id!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'gk distributionstats deleted successfully',
    data: result,
  });
});
export const gkDistributionstatsController = {
  createGkDistributionstats,
  getAllGkDistributionstats,
  getSingleGkDistributionstats,
  updateGkDistributionstats,
  deleteGkDistributionstats,
};
