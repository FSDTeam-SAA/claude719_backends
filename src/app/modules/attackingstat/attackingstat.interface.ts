import { Types } from 'mongoose';

export interface IAttackingstat {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  goals: number;
  assists: number;
  shotsNsidePr: number;
  shotsOutsidePa: number;
}
