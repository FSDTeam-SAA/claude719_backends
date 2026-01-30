import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema(
  {
    title: String,
    price: Number,
    currency: { type: String, default: 'usd' },
    description: String,
    features: [String],
    paymentType: {
      type: String,
      enum: ['Individual', 'TeamGame'],
      required: true,
    },

    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
    },

    numberOfGames: {
      type: Number,
      default: null, // monthly unlimited
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    isActive: { type: Boolean, default: true },
    totalSubscripeUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    totalSubscripeTeam: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  },
  { timestamps: true },
);

export default mongoose.model('Subscription', SubscriptionSchema);
