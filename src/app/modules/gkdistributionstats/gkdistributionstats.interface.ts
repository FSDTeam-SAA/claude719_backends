import { Types } from 'mongoose';

export interface IGkDistributionStats {
  player: Types.ObjectId;
  gk: Types.ObjectId;
  keyPasses: number;
  mediumRangePasses: number;
  passes: number;
  shortPasses: number;
  passesInFinalThird: number;
  passesForward: number;
  passesInMiddleThird: number;
  passesSideways: number;
  passesInDefensiveThird: number;
  passesReceived: number;
  longPasses: number;
}
