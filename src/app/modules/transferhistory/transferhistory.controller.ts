import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { transferhistoryService } from './transferhistory.service';

const createTransferhistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
  const leftClub = files?.['leftClub']?.[0];
  const leftCountery = files?.['leftCountery']?.[0];
  const joinedClub = files?.['joinedClub']?.[0];
  const joinedCountery = files?.['joinedCountery']?.[0];

  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await transferhistoryService.createTransferhistory(
    id!,
    fromData,
    leftClub,
    leftCountery,
    joinedClub,
    joinedCountery,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transfer history created successfully',
    data: result,
  });
});

const getAllTransferhistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  //   const filters = pick(req.query, ['searchTerm', 'status']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await transferhistoryService.getAllTransferhistory(
    id!,
    // filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transfer history fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTransferhistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await transferhistoryService.getSingleTransferhistory(id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transfer history fetched successfully',
    data: result,
  });
});

const updateTransferhistory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
  const leftClub = files?.['leftClub']?.[0];
  const leftCountery = files?.['leftCountery']?.[0];
  const joinedClub = files?.['joinedClub']?.[0];
  const joinedCountery = files?.['joinedCountery']?.[0];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await transferhistoryService.updateTransferhistory(
    id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transfer history updated successfully',
    data: result,
  });
});

const deleteTransferhistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await transferhistoryService.deleteTransferhistory(id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transfer history deleted successfully',
    data: result,
  });
});

export const transferhistoryController = {
  createTransferhistory,
  getAllTransferhistory,
  getSingleTransferhistory,
  updateTransferhistory,
  deleteTransferhistory,
};
