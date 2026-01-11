import mongoose from 'mongoose';
import { IFouls } from './fouls.interface';

const foulsSchema = new mongoose.Schema<IFouls>(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gk:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fouls:{type:Number,default:0},
    foulswon:{type:Number,default:0},
    redCards:{type:Number,default:0},
    yellowCards:{type:Number,default:0},
    offSide:{type:Number, default:0}
  },
  { timestamps: true },
);

const Fouls = mongoose.model<IFouls>('Fouls', foulsSchema);
export default Fouls;
