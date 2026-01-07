import { Types } from 'mongoose';

export interface IDefensive {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  tackleAttempts?: string;
  tackleSucceededPossession?: string;
  tackleSucceededNOPossession?: string;
  tackleFailed?: string;
  turnoverwon?: string;
  interceptions?: string;
  recoveries?: string;
  clearance?: string;
  totalBlocked?: string;
  shotBlocked?: string;
  crossBlocked?: string;
  mistakes?: string;
  aerialDuels?: string;
  phvsicalDuels?: string;
  ownGoals?: string;
}
