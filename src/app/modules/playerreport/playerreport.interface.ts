import { Types } from 'mongoose';

export interface IPlayerReport {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;

  date?: Date;
  category?: string;
  gameTitle?: string;
  rating?: number;
  position?: string;
  minutesPlayed?: number;
  deFensiveSummary?: string;
  strengths?: string;
  offensiveSummary?: string;
  weaknesses?: string;
  distributionSummary?: string;
  generalComments?: string;
}
