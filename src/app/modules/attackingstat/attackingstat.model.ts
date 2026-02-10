import mongoose from 'mongoose';
import { IAttackingstat } from './attackingstat.interface';

const attackingstatSchema = new mongoose.Schema<IAttackingstat>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    goals: { type: Number, required: true },
    assists: { type: Number, required: true },
    shotsNsidePr: { type: Number, required: true },
    shotsOutsidePa: { type: Number, required: true },
    totalShots: { type: Number, required: true },
    shotsOnTarget: { type: Number, required: true },
    shootingAccuracy: { type: String, required: true },
    shotsOffTarget: { type: Number, required: true },
    passesAccuracy: { type: String, required: true },
    takeOn: { type: Number, required: true },
  },
  { timestamps: true },
);

const Attackingstat = mongoose.model<IAttackingstat>(
  'Attackingstat',
  attackingstatSchema,
);
export default Attackingstat;
