import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { teamServices } from './team.service';

const createteam = catchAsync(async (req, res) => {
  const result = await teamServices.createteam(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team created successfully',
    data: result,
  });
});

export const teamControllers = {
  createteam,
};
