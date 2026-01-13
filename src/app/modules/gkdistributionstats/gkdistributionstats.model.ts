import mongoose from 'mongoose';
import { IGkDistributionStats } from './gkdistributionstats.interface';

const gkDistributionStatsSchema = new mongoose.Schema<IGkDistributionStats>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    keyPasses: { type: Number, required: true, default: 0 },
    mediumRangePasses: { type: Number, required: true, default: 0 },
    passes: { type: Number, required: true, default: 0 },
    shortPasses: { type: Number, required: true, default: 0 },
    passesInFinalThird: { type: Number, required: true, default: 0 },
    passesForward: { type: Number, required: true, default: 0 },
    passesInMiddleThird: { type: Number, required: true, default: 0 },
    passesSideways: { type: Number, required: true, default: 0 },
    passesInDefensiveThird: { type: Number, required: true, default: 0 },
    passesReceived: { type: Number, required: true, default: 0 },
    longPasses: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const GkDistributionStats = mongoose.model<IGkDistributionStats>(
  'GkDistributionStats',
  gkDistributionStatsSchema,
);
export default GkDistributionStats;
