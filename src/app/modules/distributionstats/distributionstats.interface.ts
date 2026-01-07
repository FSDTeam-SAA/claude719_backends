import { Types } from 'mongoose';

export interface IDistributionstats {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  passes: number;
  passesinFinalThird: number;
  passesinMiddleThird: number;
  passesinOerensiveThird: number;
}
