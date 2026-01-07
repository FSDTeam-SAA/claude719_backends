import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { nationalService } from './national.service';

const createNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const flag = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await nationalService.createNational(id!, fromData, flag);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'National created successfully',
    data: result,
  });
});

const getAllNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await nationalService.getAllNational(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'National retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await nationalService.getSingleNational(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'National retrieved successfully',
    data: result,
  });
});
const updateNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const flag = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await nationalService.updateNational(id!, fromData, flag);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'National updated successfully',
    data: result,
  });
});
const deleteNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await nationalService.deletenational(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'National deleted successfully',
    data: result,
  });
});

export const nationalController = {
  createNational,
  getAllNational,
  getSingleNational,
  updateNational,
  deleteNational,
};
