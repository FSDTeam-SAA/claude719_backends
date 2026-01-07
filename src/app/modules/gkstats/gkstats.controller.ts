import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { gkstatsService } from './gkstats.service';

const createGkStats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await gkstatsService.createGkStats(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'GkStats created successfully',
    data: result,
  });
});

const getAllGkStats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await gkstatsService.getAllGKStats(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'GkStats retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGkStats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await gkstatsService.getSingleGKStats(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'GkStats retrieved successfully',
    data: result,
  });
});
const updateGkStats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await gkstatsService.updateGKStats(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'GkStats updated successfully',
    data: result,
  });
});
const deleteGkStats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await gkstatsService.deleteGKStats(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'GkStats deleted successfully',
    data: result,
  });
});
export const gkStatsController = {
  createGkStats,
  getAllGkStats,
  getSingleGkStats,
  updateGkStats,
  deleteGkStats,
};
