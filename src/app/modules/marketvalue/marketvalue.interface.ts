import { Types } from 'mongoose';

export interface IMarketvalue {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  marketValue?: number;
}
