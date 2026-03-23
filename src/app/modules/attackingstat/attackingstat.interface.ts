import { Types } from 'mongoose';

export interface IAttackingstat {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  goals: string;
  assists: string;
  shotsNsidePr: string;
  shotsOutsidePa: string;
  totalShots: string;
  shotsOnTarget: string;
  shootingAccuracy: string;
  shotsOffTarget: string;
  passesAccuracy: string;
  takeOn: string;
}
