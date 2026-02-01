import { Schema, model } from 'mongoose';
import { IMarketvalue } from './marketvalue.interface';

const marketvalueSchema = new Schema<IMarketvalue>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    marketValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Marketvalue = model<IMarketvalue>('Marketvalue', marketvalueSchema);

export default Marketvalue;
