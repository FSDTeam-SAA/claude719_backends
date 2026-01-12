import { Types } from 'mongoose';

export interface IDefensive {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  tackleAttempts?: number;
  tackleSucceededPossession?: number;
  tackleSucceededNOPossession?: number;
  tackleFailed?: number;
  turnoverwon?: number;
  interceptions?: number;
  recoveries?: number;
  clearance?: number;
  totalBlocked?: number;
  shotBlocked?: number;
  crossBlocked?: number;
  mistakes?: number;
  aerialDuels?: number;
  phvsicalDuels?: number;
  ownGoals?: number;
}
