import mongoose from 'mongoose';
import { IFouls } from './fouls.interface';

const foulsSchema = new mongoose.Schema<IFouls>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fouls: { type: String },
    foulswon: { type: String },
    redCards: { type: String },
    yellowCards: { type: String },
    offside: { type: String },
  },
  { timestamps: true },
);

const Fouls = mongoose.model<IFouls>('Fouls', foulsSchema);
export default Fouls;
