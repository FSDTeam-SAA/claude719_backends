import AppError from '../../error/appError';
import { INewsletter } from './newsletter.interface';
import Newsletter from './newsletter.model';
import sendMailer from '../../helper/sendMailer';

const createNewsLetter = async (payload: INewsletter) => {
  const newsletter = await Newsletter.findOne({ email: payload.email });
  if (!newsletter) {
    const result = await Newsletter.create(payload);
    return result;
  }
  return newsletter;
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
  broadcastNewsletter,
};
