import { Types } from 'mongoose';

export interface ITeamPlayer {
  user?: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  usedGames?: number;
}

export interface ITeam {
  _id?: Types.ObjectId;

  teamName?: string;

  coachName?: string;
  coachEmail: string;

  players: ITeamPlayer[];

  subscription?: Types.ObjectId;
  subscriptionExpiry?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
