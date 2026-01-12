import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { defensiveService } from './defensive.service';

const createDefensive = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await defensiveService.createDefensive(id!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'defensive created successfully',
    data: result,
  });
});

// const createOrUpdateDefensive = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const result = await defensiveService.createOrUpdateDefensive(id!, req.body);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'defensive created successfully',
//     data: result,
//   });
// });

const getAllDefensive = catchAsync(async (req, res) => {
  const { id } = req.params;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await defensiveService.getAllDefensive(id!, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'defensive retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleNational = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await defensiveService.getSingleDefensive(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'defensive retrieved successfully',
    data: result,
  });
});
const updateDefensive = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await defensiveService.updateNational(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'defensive updated successfully',
    data: result,
  });
});
const deleteDefensive = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await defensiveService.deleteDefensive(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'defensive deleted successfully',
    data: result,
  });
});

export const defensiveController = {
  createDefensive,
  // createOrUpdateDefensive,
  getAllDefensive,
  getSingleNational,
  updateDefensive,
  deleteDefensive,
};
