import { Types } from 'mongoose';

export interface IRating {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  rating?: number;
  position?: string[];
  gamesNumber?: number;
  minutes?: number;
}
