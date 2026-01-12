import catchAsync from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import { dashboardService } from "./dashboard.service";

const dashboardOverview = catchAsync(async(req, res) => {

    const userId = req.user.id;
    const result = await dashboardService.dashboardOverview( userId );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Get all dashboard overview data successfully',
        data: result,
    });

})


const getMonthlyReveneueChart = catchAsync(async(req, res) =>{

    const userId = req.user.id;
    const year = Number(req.query.year) || new Date().getFullYear();

    const result = await dashboardService.getMonthlyReveneueChart( year );

    sendResponse(res, {
        statusCode: 200,
        success:true,
        message: 'Get getMonthlyReveneiwChart successfully',
        data: result
    })
})

export const dashboardController = {
    dashboardOverview,
    getMonthlyReveneueChart
}