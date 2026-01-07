import { Types } from 'mongoose';

export interface IFouls {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  fouls?: number;
  foulswon?: number;
  yellowCards?: number;
  redCards?: number;
}
