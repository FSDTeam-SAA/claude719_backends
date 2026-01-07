import { Types } from 'mongoose';

export interface IGkstats {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  goalsConceded?: number;
  penaltKitkSave?: number;
  saves?: number;
  aerialControl?: number;
  catches?: number;
  deFensiveLineSupport?: number;
  parries?: number;
}
