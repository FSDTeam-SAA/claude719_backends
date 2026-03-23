import { Types } from 'mongoose';

export interface IFouls {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  fouls?: string;
  foulswon?: string;
  yellowCards?: string;
  redCards?: string;
  offside?: string;
}
