import mongoose from 'mongoose';
import { ISetpieces } from './setpieces.interface';

const setpiecesSchema = new mongoose.Schema<ISetpieces>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    freekicks: { type: Number, default: 0 },
    freekicksShots: { type: Number, default: 0 },
    freekicksShotsonTarget: { type: Number, default: 0 },
    penaltyKicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Setpieces = mongoose.model<ISetpieces>('Setpieces', setpiecesSchema);
export default Setpieces;
