import { Types } from 'mongoose';

export interface ISetpieces {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  freekicks?: string;
  freekicksShots?: string;
  freekicksShotsonTarget?: string;
  penaltyKicks?: string;
}
