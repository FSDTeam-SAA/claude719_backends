import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcryptjs';
import { calculateAge } from '../../helper/calculateAge';

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
    age: {
      type: Number,
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
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    numberOfGame: Number,
    team: { type: mongoose.Schema.ObjectId, ref: 'Team' },
    teamName: {
      type: String,
    },
    teamLocation: {
      type: String,
    },
    address: {
      type: String,
    },
    joiningDate: {
      type: Date,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified('dob') && this.dob) {
    this.age = calculateAge(this.dob);
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;

  // support both { dob } and { $set: { dob } }
  const dob = update?.dob || update?.$set?.dob;

  if (dob) {
    const age = calculateAge(dob);

    if (update.$set) {
      update.$set.age = age;
    } else {
      update.age = age;
    }
  }

  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
