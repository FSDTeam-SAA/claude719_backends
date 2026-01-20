import { Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: 'player' | 'admin' | 'gk';
  profileImage?: string;
  phone?: string;
  phoneCode?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  stripeAccountId?: string;
  provider?: 'google' | 'credentials';

  // user profile
  gender?: 'male' | 'female' | 'other';
  hight?: string;
  weight?: string;
  dob?: string;
  age?: number;
  birthdayPlace?: string;
  citizenship?: string;
  currentClub?: string;
  league?: string; //object id of league
  category?: string;
  foot?: string;
  position?: string[];
  agent?: string;
  socialMedia?: {
    name: string;
    url: string;
  }[];
  inSchoolOrCollege: boolean; // Yes / No
  institute?: string;
  gpa?: string;
  playingVideo?: string[];
  address?: string;
  joiningDate?: Date;
  schoolName?: string;
  // designation?: string;
  nationality?:string;

  isSubscription?: boolean;
  subscription?: Types.ObjectId;
  subscriptionExpiry?: Date;
  // subscriptionPlan?: string;
  // subscriptionStatus?: string;

  // admin profile
  designation?: string;
  accessLavel?: string;
  lastLogin?: Date;
  numberOfGame: number;
  team: Types.ObjectId;
  teamName?: string;
  teamLocation?: string;
  jerseyNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
}
