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
    tackleAttempts: { type: Number },
    tackleSucceededPossession: { type: Number },
    tackleSucceededNOPossession: { type: Number },
    tackleFailed: { type: Number },
    turnoverwon: { type: Number },
    interceptions: { type: Number },
    recoveries: { type: Number },
    clearance: { type: Number },
    totalBlocked: { type: Number },
    shotBlocked: { type: Number },
    crossBlocked: { type: Number },
    mistakes: { type: Number },
    aerialDuels: { type: Number },
    phvsicalDuels: { type: Number },
    ownGoals: { type: Number },
  },
  {
    timestamps: true,
  },
);

const Defensive = mongoose.model<IDefensive>('Defensive', defensiveSchema);
export default Defensive;
