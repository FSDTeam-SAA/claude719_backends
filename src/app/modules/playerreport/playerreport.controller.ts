import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { playerReportService } from './playerreport.service';

const createPlayerreport = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await playerReportService.createPlayerreport(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Player report created successfully',
    data: result,
  });
});

const getAllPlayerreports = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await playerReportService.getAllPlayerreport(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player report retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePlayerreport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await playerReportService.getSinglePlayerreport(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player report retrieved successfully',
    data: result,
  });
});
const updatePlayerreport = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await playerReportService.updatePlayerreport(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player report updated successfully',
    data: result,
  });
});
const deletePlayerreport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await playerReportService.deletePlayerreport(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player report deleted successfully',
    data: result,
  });
});
export const PlayerreportController = {
  createPlayerreport,
  getAllPlayerreports,
  getSinglePlayerreport,
  updatePlayerreport,
  deletePlayerreport,
};
