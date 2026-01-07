import mongoose from 'mongoose';
import { IContact } from './contact.interface';

const contactSchema = new mongoose.Schema<IContact>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
