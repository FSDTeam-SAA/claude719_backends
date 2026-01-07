import mongoose, { Schema } from 'mongoose';
import { ITransferhistory } from './transferhistory.interface';

const TransferHistorySchema = new Schema<ITransferhistory>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    gk: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Left club info
    leftClubName: {
      type: String,
      trim: true,
    },
    leftClub: {
      type: String,
    },
    leftCountery: {
      type: String,
    },

    // Joined club info
    joinedclubName: {
      type: String,
      trim: true,
    },
    joinedClub: {
      type: String,

    },
    joinedCountery: {
      type: String,

    },
  },
  {
    timestamps: true,
  },
);

const TransferHistory = mongoose.model<ITransferhistory>(
  'TransferHistory',
  TransferHistorySchema,
);

export default TransferHistory;
