import pick from '../../helper/pick';
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

const getAllnewsLetter = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'email']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await newsletterService.getAllnewsLetter(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'NewsLetter fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const result = await newsletterService.getSingle(req.params.id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'NewsLetter fetched successfully',
    data: result,
  });
});

const deleteNewsletter = catchAsync(async (req, res) => {
  const result = await newsletterService.deleteNewsletter(req.params.id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'NewsLetter deleted successfully',
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
  getAllnewsLetter,
  getSingle,
  deleteNewsletter,
  broadcastNewsletter,
};
