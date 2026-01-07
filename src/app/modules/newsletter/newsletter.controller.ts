import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { newsletterService } from './newsletter.service';

const createNewsLetter = catchAsync(async (req, res) => {
  const result = await newsletterService.createNewsLetter(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'NewsLetter created successfully',
    data: result,
  });
});

const broadcastNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.broadcastNewsletter(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'NewsLetter broadcasted successfully',
    data: result,
  });
});

export const newsletterController = {
  createNewsLetter,
  broadcastNewsletter,
};
