import mongoose from 'mongoose';
import { INational } from './national.interface';

const nationalSchema = new mongoose.Schema<INational>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    flag: {
      type: String,
    },
    teamName: {
      type: String,
    },
    debut: {
      type: Date,
      default: Date.now,
    },
    match: {
      type: Number,
      default: 0,
    },
    goals: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const National = mongoose.model<INational>('National', nationalSchema);
export default National;
