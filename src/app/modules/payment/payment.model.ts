import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },

    // paymentType: {
    //   type: String,
    //   enum: ['team'],
    //   default: 'team',
    // },

    stripeSessionId: String,
    stripePaymentIntentId: String,

    amount: Number,
    currency: String,

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    paymentType: {
      type: String,
      enum: ['Individual', 'TeamGame'],
      required: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
