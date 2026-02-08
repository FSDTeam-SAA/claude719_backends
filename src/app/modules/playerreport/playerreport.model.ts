import mongoose, { Schema, Types } from 'mongoose';
import { IPlayerReport } from './playerreport.interface';

const playerReportSchema = new Schema<IPlayerReport>(
  {
    player: {
      type: Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      trim: true,
    },
    gameTitle: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    position: [{
      type: String,
      trim: true,
    }],
    minutesPlayed: {
      type: Number,
      min: 0,
    },
    deFensiveSummary: {
      type: String,
      trim: true,
    },
    numberOfGames:{
      
      type: Number,
      default: 0
    },
    strengths: {
      type: String,
      trim: true,
    },
    offensiveSummary: {
      type: String,
      trim: true,
    },
    weaknesses: {
      type: String,
      trim: true,
    },
    distributionSummary: {
      type: String,
      trim: true,
    },
    generalComments: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const PlayerReport = mongoose.model<IPlayerReport>(
  'PlayerReport',
  playerReportSchema,
);

export default PlayerReport;
