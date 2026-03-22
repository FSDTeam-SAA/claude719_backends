import { Types } from 'mongoose';

export interface IDistributionstats {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  passes: string;
  passesinFinalThird: string;
  passesinMiddleThird: string;
  passesinOerensiveThird: string;
  kevPasses: string;
  longPasses: string;
  mediumPasses: string;
  shortPasses: string;
  passesForward: string;
  passesSidewavs: string;
  crosses: string;
  passesBackward: string;
  passesReceived: string;
  stepIn: string;
  turnoverConceded: string;
  mostPassesPlayerBetween: string;
  passTheMost?: string;
  ballTheMost?: string;
}
