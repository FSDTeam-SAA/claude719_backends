import { Types } from 'mongoose';

export interface INational {
  player?: Types.ObjectId;
  gk?: Types.ObjectId;
  flag?: string;
  teamName?: string;
  goals?: string;
  debut?: Date;
  match?: string;
  category?: string;
}
