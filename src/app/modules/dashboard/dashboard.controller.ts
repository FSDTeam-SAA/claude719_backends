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

const getAllPlayersRevenue = catchAsync(async(req, res) => {
    
     const filters = pick(req.query, [
        'searchTerm',
        'user.firstName',
        'user.lastName',
        'user.category',
        'user.teamName',
        'user.league',
      ]);
    
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await dashboardService.getAllPlayersRevenue(filters, options);

    sendResponse(res, {
        statusCode:200,
        success: true,
        message:"Get all player reveneue successfully",
        data:result
    });
})

const getAllTeamReveneue = catchAsync(async(req, res) =>{

    const filters = pick(req.query, [
       'searchTerm',
       'team.teamName',
       'team.coachName',
       'team.coachEmail',
      ]);
    
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await dashboardService.getAllTeamReveneue(filters, options);

    sendResponse(res, {
        statusCode:200,
        success:true,
        message:"Get all team reveneue successfully",
        data: result
    })
})

const singleplayerView = catchAsync(async(req, res) => {

    const playerId = req.params.id;
    const result = await dashboardService.singleplayerView(playerId!);

    sendResponse(res, {
        statusCode:200,
        success:true,
        message:"Get single player view successfully",
        data: result
    })
})
const singleTeamView = catchAsync(async(req, res) => {

    const teamId = req.params.id;
    const result = await dashboardService.singleTeamView(teamId!);

    sendResponse(res, {
        statusCode:200,
        success:true,
        message:"Get single team view successfully",
        data: result
    })
})

const deletePlayerAccount = catchAsync(async(req, res) => {

    const playerId = req.params.id;
    const result = await dashboardService.deletePlayerAccount(playerId!);

    sendResponse(res, {
        statusCode:200,
        success:true,
        message:"Player account deleted successfully",
        data: result
    })
});

const deleteTeamAccount = catchAsync(async(req, res) => {

    const teamId = req.params.id;
    const result = await dashboardService.deleteTeamAccount(teamId!);

    sendResponse(res, {
        statusCode:200,
        success:true,
        message:"Team account deleted successfully",
        data: result
    })
});

export const dashboardController = {
    dashboardOverview,
    getMonthlyReveneueChart,
    getAllPlayersRevenue,
    getAllTeamReveneue,
    singleplayerView,
    singleTeamView,
    deletePlayerAccount,
    deleteTeamAccount
};
