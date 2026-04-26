import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { coponService } from './copon.service';

const createCopon = catchAsync(async (req, res) => {
  const result = await coponService.createCopon(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon created successfully',
    data: result,
  });
});

const getAllCopon = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, [
    'code',
    'event',
    'offer',
    'codeType',
    'offerType',
    'expiryDate',
    'minOrderAmount',
    'maxDiscount',
    'isPublic',
    'isActive',
  ]);
  const result = await coponService.getAllCopon(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCopon = catchAsync(async (req, res) => {
  const result = await coponService.getSingleCopon(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon fetched successfully',
    data: result,
  });
});

const getSingleCoponCode = catchAsync(async (req, res) => {
  const result = await coponService.getSingleCoponCode(req.params.code!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon fetched successfully',
    data: result,
  });
});

const updateCopon = catchAsync(async (req, res) => {
  const result = await coponService.updateCopon(req.params.id!, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon updated successfully',
    data: result,
  });
});

const applyCopon = catchAsync(async (req, res) => {
  const result = await coponService.applyCopon(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon applied successfully',
    data: result,
  });
});

const deleteCopon = catchAsync(async (req, res) => {
  const result = await coponService.deleteCopon(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Copon deleted successfully',
    data: result,
  });
});

export const coponController = {
  createCopon,
  getAllCopon,
  getSingleCopon,
  getSingleCoponCode,
  updateCopon,
  deleteCopon,
  applyCopon,
};
