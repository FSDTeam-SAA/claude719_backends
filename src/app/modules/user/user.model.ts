import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['player', 'admin', 'gk', 'coach'],
      required: true,
    },
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      default: 'google',
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    stripeAccountId: {
      type: String,
    },
    jerseyNumber: {
      type: String,
    },

    // user profile
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    hight: {
      type: String,
    },
    weight: {
      type: String,
    },
    dob: {
      type: String,
    },
    birthdayPlace: {
      type: String,
    },
    citizenship: {
      type: String,
    },
    currentClub: {
      type: String,
    },
    league: {
      type: String,
    },
    category: {
      type: String,
    },
    foot: {
      type: String,
    },
    position: [
      {
        type: String,
      },
    ],
    agent: {
      type: String,
    },
    socialMedia: {
      type: [String],
      default: [],
    },

    inSchoolOrCollege: {
      type: Boolean,
    },
    institute: {
      type: String,
    },
    gpa: {
      type: String,
    },

    playingVideo: {
      type: [String],
      default: [],
    },

    // subscriptionPlan: {
    //   type: String,
    // },
    // subscriptionStatus: {
    //   type: String,
    // },
    isSubscription: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    subscriptionExpiry: {
      type: Date,
    },

    // admin profile
    designation: {
      type: String,
    },
    accessLavel: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
    },
    numberOfGame: Number,
    team: { type: mongoose.Schema.ObjectId, ref: 'Team' },
    teamName: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
