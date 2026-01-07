import { Types } from 'mongoose';

export interface ISetpieces {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  freekicks?: number;
  freekicksShots?: number;
  freekicksShotsonTarget?: number;
  penaltyKicks?: number;
}
