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
      type: String,
      required: true,
      default: '0',
    },
    passesinFinalThird: {
      type: String,
      required: true,
      default: '0',
    },
    passesinMiddleThird: {
      type: String,
      required: true,
      default: '0',
    },
    passesinOerensiveThird: {
      type: String,
      required: true,
      default: '0',
    },

    kevPasses: {
      type: String,
      required: true,
      default: '0',
    },
    longPasses: {
      type: String,
      required: true,
      default: '0',
    },
    mediumPasses: {
      type: String,
      required: true,
      default: '0',
    },
    shortPasses: {
      type: String,
      required: true,
      default: '0',
    },
    passesForward: {
      type: String,
      required: true,
      default: '0',
    },
    passesSidewavs: {
      type: String,
      required: true,
      default: '0',
    },
    passesBackward: {
      type: String,
      required: true,
      default: '0',
    },
    passesReceived: {
      type: String,
      required: true,
      default: '0',
    },
    crosses: {
      type: String,
      required: true,
      default: '0',
    },
    stepIn: {
      type: String,
      required: true,
      default: '0',
    },
    turnoverConceded: {
      type: String,
      required: true,
      default: '0',
    },
    mostPassesPlayerBetween: {
      type: String,
      required: true,
      default: '0',
    },

    passTheMost: {
      type: String,
    },
    ballTheMost: {
      type: String,
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
