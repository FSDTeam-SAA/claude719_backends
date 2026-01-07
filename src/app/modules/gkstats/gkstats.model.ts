import mongoose from 'mongoose';
import { IGkstats } from './gkstats.interface';

const gkstatsSchema = new mongoose.Schema<IGkstats>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    goalsConceded: { type: Number, default: 0 },
    penaltKitkSave: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    aerialControl: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    deFensiveLineSupport: { type: Number, default: 0 },
    parries: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Gkstats = mongoose.model<IGkstats>('Gkstats', gkstatsSchema);
export default Gkstats;
