import { Types } from 'mongoose';

export interface IDistributionstats {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  passes: number;
  passesinFinalThird: number;
  passesinMiddleThird: number;
  passesinOerensiveThird: number;
  kevPasses: number;
  tongPasses: number;
  mecnumPasses: number;
  shortPasses: number;
  passesForward: number;
  passesSidewavs: number;
  passesBackward: number;
  passesReceived: number;
  stepIn: number;
  turnoverConceded: number;
  mostPassesPlayerBetween: number;
}
