import mongoose from 'mongoose';
import { IRating } from './rating.interface';

const ratingSchema = new mongoose.Schema<IRating>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
    },
    position: {
      type: String,
    },
    numberOfGames: {
      type: Number,
    },
    minutes: {
      type: Number,
    },
  },
  { timestamps: true },
);
const Rating = mongoose.model<IRating>('Rating', ratingSchema);
export default Rating;
