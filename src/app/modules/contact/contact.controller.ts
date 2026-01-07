import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { contactService } from './contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await contactService.createContact(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});

const getAllContact = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'fullName',
    'message',
    'email',
    'phone',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contactService.getAllContact(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactService.getSingleContact(id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact fetched successfully',
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactService.updateContact(id!, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactService.deleteContact(id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});

export const contactController = {
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact,
};
