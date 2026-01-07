import { Types } from 'mongoose';

export interface IRating {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  rating?: number;
  position?: string;
  numberOfGames?: number;
  minutes?: number;
}
