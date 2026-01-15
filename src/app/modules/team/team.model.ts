import mongoose from 'mongoose';
import { ITeam } from './team.interface';

const TeamSchema = new mongoose.Schema<ITeam>(
  {
    teamName: String,

    coachName: {
      type: String,
    },
    coachEmail: {
      type: String,
      require: true,
    },
    category: {
      type: String,
    },
    league: {
      type: String,
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        email: String,
        role: String,
        usedGames: {
          type: Number,
          default: 0,
        },
      },
    ],

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },

    subscriptionExpiry: Date,
  },
  { timestamps: true },
);

const Team = mongoose.model<ITeam>('Team', TeamSchema);
export default Team;
