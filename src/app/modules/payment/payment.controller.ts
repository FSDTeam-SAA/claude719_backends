import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const getAllPayments = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'paymentMethod', 'status']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await PaymentService.getAllPayments(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentService.getPaymentById(id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

export const PaymentController = { getAllPayments, getPaymentById };
