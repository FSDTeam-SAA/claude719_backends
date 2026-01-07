import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { foulsService } from './fouls.service';

const createFouls = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await foulsService.createFouls(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Fouls created successfully',
    data: result,
  });
});

const getAllFouls = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await foulsService.getAllFouls(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fouls retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFouls = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await foulsService.getSingleFouls(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fouls retrieved successfully',
    data: result,
  });
});
const updateFouls = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await foulsService.updateFouls(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fouls updated successfully',
    data: result,
  });
});
const deleteFouls = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await foulsService.deleteFouls(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fouls deleted successfully',
    data: result,
  });
});
export const foulsController = {
  createFouls,
  getAllFouls,
  getSingleFouls,
  updateFouls,
  deleteFouls,
};
