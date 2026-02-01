import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { marketvalueService } from './marketvalue.service';

const createMarketvalue = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await marketvalueService.createMarketvalue(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'market value created successfully',
    data: result,
  });
});

const getAllMarketvalue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await marketvalueService.getAllMarketvalue(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'market value retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleMarketvalue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await marketvalueService.getSingleMarketvalue(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'market value retrieved successfully',
    data: result,
  });
});
const updateMarketvalue = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await marketvalueService.updateMarketvalue(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'distributionstats updated successfully',
    data: result,
  });
});
const deleteMarketvalue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await marketvalueService.deleteMarketvalue(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'market value deleted successfully',
    data: result,
  });
});
export const marketvalueController = {
  createMarketvalue,
  getAllMarketvalue,
  getSingleMarketvalue,
  updateMarketvalue,
  deleteMarketvalue,
};
