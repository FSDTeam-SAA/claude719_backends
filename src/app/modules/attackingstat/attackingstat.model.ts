import mongoose from 'mongoose';
import { IAttackingstat } from './attackingstat.interface';

const attackingstatSchema = new mongoose.Schema<IAttackingstat>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    goals: { type: String, required: true },
    assists: { type: String, required: true },
    shotsNsidePr: { type: String, required: true },
    shotsOutsidePa: { type: String, required: true },
    totalShots: { type: String, required: true },
    shotsOnTarget: { type: String, required: true },
    shootingAccuracy: { type: String, required: true },
    shotsOffTarget: { type: String, required: true },
    passesAccuracy: { type: String, required: true },
    takeOn: { type: String, required: true },
  },
  { timestamps: true },
);

const Attackingstat = mongoose.model<IAttackingstat>(
  'Attackingstat',
  attackingstatSchema,
);
export default Attackingstat;
