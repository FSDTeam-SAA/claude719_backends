import { Types } from 'mongoose';

export interface IDistributionstats {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  passes: number;
  passesinFinalThird: number;
  passesinMiddleThird: number;
  passesinOerensiveThird: number;
  kevPasses: number;
  longPasses: number;
  mediumPasses: number;
  shortPasses: number;
  passesForward: number;
  passesSidewavs: number;
  crosses: number;
  passesBackward: number;
  passesReceived: number;
  stepIn: number;
  turnoverConceded: number;
  mostPassesPlayerBetween: number;
  passTheMost?: string;
  ballTheMost?: string;
}
