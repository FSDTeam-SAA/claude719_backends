import mongoose from 'mongoose';
import { ISetpieces } from './setpieces.interface';

const setpiecesSchema = new mongoose.Schema<ISetpieces>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    freekicks: { type: String},
    freekicksShots: { type: String },
    freekicksShotsonTarget: { type: String },
    penaltyKicks: { type: String},
  },
  { timestamps: true },
);

const Setpieces = mongoose.model<ISetpieces>('Setpieces', setpiecesSchema);
export default Setpieces;
