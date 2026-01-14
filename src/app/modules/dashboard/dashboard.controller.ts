import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

const dashboardOverview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await dashboardService.dashboardOverview(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get all dashboard overview data successfully',
    data: result,
  });
});

const getMonthlyReveneueChart = catchAsync(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const result = await dashboardService.getMonthlyReveneueChart(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get getMonthlyReveneiwChart successfully',
    data: result,
  });
});

// const totalRevenue = catchAsync(async (req, res) => {
//   const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
//   const filters = pick(req.query, [
//     'searchTerm',
//     'year',
//     'paymentType',
//     'status',
//   ]);
//   const result = await dashboardService.totalRevenue(filters, options);

//   const { meta, data, totalPayments, totalRevenue } = result;
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Get total revenue successfully',
//     meta: meta,
//     data: {
//       totalRevenue: totalRevenue,
//       totalPayments: totalPayments,
//       data: data,
//     },
//   });
// });

const totalRevenue = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, ['searchTerm', 'paymentType', 'status']);
  const result = await dashboardService.totalRevenue(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get total revenue successfully',
    meta: result.meta,
    data: result.data,
  });
});

const singleplayerView = catchAsync(async (req, res) => {
  const playerId = req.params.id;
  const result = await dashboardService.singleplayerView(playerId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single player view successfully',
    data: result,
  });
});
const singleTeamView = catchAsync(async (req, res) => {
  const teamId = req.params.id;
  const result = await dashboardService.singleTeamView(teamId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single team view successfully',
    data: result,
  });
});

const deletePlayerAccount = catchAsync(async (req, res) => {
  const playerId = req.params.id;
  const result = await dashboardService.deletePlayerAccount(playerId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Player account deleted successfully',
    data: result,
  });
});

const deleteTeamAccount = catchAsync(async (req, res) => {
  const teamId = req.params.id;
  const result = await dashboardService.deleteTeamAccount(teamId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team account deleted successfully',
    data: result,
  });
});

export const dashboardController = {
  dashboardOverview,
  getMonthlyReveneueChart,
  singleplayerView,
  singleTeamView,
  deletePlayerAccount,
  deleteTeamAccount,
  totalRevenue,
};
