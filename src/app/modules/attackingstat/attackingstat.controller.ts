import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { attackingstatService } from './attackingstat.service';

const createAttackingstat = catchAsync(async (req, res) => {
  const { id } = req.params; 

  const result = await attackingstatService.createAttackingstat(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Attackingstat created successfully',
    data: result,
  });
});

const getAllAttackingstat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await attackingstatService.getAllAttackingstat(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attacking stat retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAttackingstat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await attackingstatService.getSingleAttackingstat(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attacking stat retrieved successfully',
    data: result,
  });
});
const updateAttackingstat = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await attackingstatService.updateAttackingstat(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attacking stat updated successfully',
    data: result,
  });
});
const deleteAttackingstat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await attackingstatService.deleteAttackingstat(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Attacking stat deleted successfully',
    data: result,
  });
});
export const attackingstatController = {
  createAttackingstat,
  getAllAttackingstat,
  getSingleAttackingstat,
  updateAttackingstat,
  deleteAttackingstat,
};
