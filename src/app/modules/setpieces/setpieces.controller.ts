import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { setpiecesService } from './setpieces.service';

const createSetpieces = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await setpiecesService.createSetpieces(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Setpieces created successfully',
    data: result,
  });
});

const getAllSetpieces = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await setpiecesService.getAllSetpieces(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Setpieces retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSetpieces = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await setpiecesService.getSingleSetpieces(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Setpieces retrieved successfully',
    data: result,
  });
});
const updateSetpieces = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await setpiecesService.updateSetpieces(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Setpieces updated successfully',
    data: result,
  });
});
const deleteSetpieces = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await setpiecesService.deleteSetpieces(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Setpieces deleted successfully',
    data: result,
  });
});
export const setpiecesController = {
  createSetpieces,
  getAllSetpieces,
  getSingleSetpieces,
  updateSetpieces,
  deleteSetpieces,
};
