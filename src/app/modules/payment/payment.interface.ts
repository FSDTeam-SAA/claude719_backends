import { Types } from 'mongoose';

export interface ITeamPlayer {
  name: string;
  email?: string;
  role?: string;
}

export interface IPayment {
  user: Types.ObjectId;
  subscription: Types.ObjectId;
  

  paymentType: 'Individual' | 'TeamGame';

  stripeSessionId: string;
  stripePaymentIntentId?: string;

  amount: number;
  currency: string;

  status: 'pending' | 'completed' | 'failed' | 'refunded';

  // ===== Common fields =====
  category?: string;
  leaguedoPlay?: string;

  // ===== Individual Player =====
  playerName?: string;

  // ===== Team =====
  teamName?: string;
  coachName?: string;
  teamPlayers?: ITeamPlayer[];

  createdAt?: Date;
  updatedAt?: Date;
}
