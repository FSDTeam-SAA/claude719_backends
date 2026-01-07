import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { distributionstatsService } from './distributionstats.service';

const createDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await distributionstatsService.createDistributionstats(
    id!,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'distributionstats created successfully',
    data: result,
  });
});

const getAllDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await distributionstatsService.getAllDistributionstats(
    id!,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'distributionstats retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await distributionstatsService.getSingleDistributionstats(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'distributionstats retrieved successfully',
    data: result,
  });
});
const updateDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await distributionstatsService.updateDistributionstats(
    id!,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'distributionstats updated successfully',
    data: result,
  });
});
const deleteDistributionstats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await distributionstatsService.deleteDistributionstats(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'distributionstats deleted successfully',
    data: result,
  });
});
export const distributionstatsController = {
  createDistributionstats,
  getAllDistributionstats,
  getSingleDistributionstats,
  updateDistributionstats,
  deleteDistributionstats,
};
