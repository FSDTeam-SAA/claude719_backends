import AppError from '../../error/appError';
import { INewsletter } from './newsletter.interface';
import Newsletter from './newsletter.model';
import sendMailer from '../../helper/sendMailer';
import pagination, { IOption } from '../../helper/pagenation';

const createNewsLetter = async (payload: INewsletter) => {
  const newsletter = await Newsletter.findOne({ email: payload.email });
  if (!newsletter) {
    const result = await Newsletter.create(payload);
    return result;
  }
  return newsletter;
};

const getAllnewsLetter = async (params: any, options: IOption) => {
  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const userSearchableFields: string[] = ['email'];
  const andCondition: any[] = [];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Newsletter.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);

  const total = await Newsletter.countDocuments(whereCondition);
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingle = async (id: string) => {
  const result = await Newsletter.findById(id);
  if (!result) {
    throw new AppError(404, 'Newsletter not found');
  }
  return result;
};

const deleteNewsletter = async (id: string) => {
  const result = await Newsletter.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Newsletter not found');
  }
  return result;
};

const broadcastNewsletter = async (payload: {
  subject?: string;
  html?: string;
}) => {
  const { subject, html } = payload;

  if (!subject || !html) {
    throw new AppError(400, 'Subject and html are required');
  }

  const newsletter = await Newsletter.find();

  if (newsletter.length === 0) {
    throw new AppError(400, 'No subscribers found');
  }

  await Promise.all(
    newsletter.map((sub) => sendMailer(sub.email, subject, html)),
  );

  return { sendCount: newsletter.length };
};

export const newsletterService = {
  createNewsLetter,
  getAllnewsLetter,
  getSingle,
  deleteNewsletter,
  broadcastNewsletter,
};
