import mongoose from 'mongoose';
import { IDefensive } from './defensive.interface';

const defensiveSchema = new mongoose.Schema<IDefensive>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tackleAttempts: { type: String },
    tackleSucceededPossession: { type: String },
    tackleSucceededNOPossession: { type: String },
    tackleFailed: { type: String },
    turnoverwon: { type: String },
    interceptions: { type: String },
    recoveries: { type: String },
    clearance: { type: String },
    totalBlocked: { type: String },
    shotBlocked: { type: String },
    crossBlocked: { type: String },
    mistakes: { type: String },
    aerialDuels: { type: String },
    phvsicalDuels: { type: String },
    ownGoals: { type: String },
  },
  {
    timestamps: true,
  },
);

const Defensive = mongoose.model<IDefensive>('Defensive', defensiveSchema);
export default Defensive;
