import { Types } from 'mongoose';

export interface ITransferhistory {
  player: Types.ObjectId;
  gk: Types.ObjectId;
  season: string;
  date: Date;
  leftClubName?: string;
  leftClub?: string;
  leftCountery?: string;
  joinedclubName?: string;
  joinedClub?: string;
  joinedCountery?: string;
}
