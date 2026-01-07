import mongoose from 'mongoose';
import { INewsletter } from './newsletter.interface';

const newsletterSchema = new mongoose.Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Newsletter = mongoose.model<INewsletter>('Newsletter', newsletterSchema);
export default Newsletter;
