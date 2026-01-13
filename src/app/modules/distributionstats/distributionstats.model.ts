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

    kevPasses: {
      type: Number,
      required: true,
      default: 0,
    },
    longPasses: {
      type: Number,
      required: true,
      default: 0,
    },
    mediumPasses: {
      type: Number,
      required: true,
      default: 0,
    },
    shortPasses: {
      type: Number,
      required: true,
      default: 0,
    },
    passesForward: {
      type: Number,
      required: true,
      default: 0,
    },
    passesSidewavs: {
      type: Number,
      required: true,
      default: 0,
    },
    passesBackward: {
      type: Number,
      required: true,
      default: 0,
    },
    passesReceived: {
      type: Number,
      required: true,
      default: 0,
    },
    crosses: {
      type: Number,
      required: true,
      default: 0,
    },
    stepIn: {
      type: Number,
      required: true,
      default: 0,
    },
    turnoverConceded: {
      type: Number,
      required: true,
      default: 0,
    },
    mostPassesPlayerBetween: {
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
