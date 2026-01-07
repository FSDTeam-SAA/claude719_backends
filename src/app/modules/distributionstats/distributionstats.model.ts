import mongoose, { Schema, Types } from 'mongoose';
import { IDistributionstats } from './distributionstats.interface';

const distributionstatsSchema = new Schema<IDistributionstats>(
  {
    player: {
      type: Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: Types.ObjectId,
      ref: 'User',
    },
    passes: {
      type: Number,
      required: true,
      default: 0,
    },
    passesinFinalThird: {
      type: Number,
      required: true,
      default: 0,
    },
    passesinMiddleThird: {
      type: Number,
      required: true,
      default: 0,
    },
    passesinOerensiveThird: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Distributionstats = mongoose.model<IDistributionstats>(
  'Distributionstats',
  distributionstatsSchema,
);

export default Distributionstats;
