import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  profilePicUrl?: string;
  email?: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  verified?: boolean;

  createdAt?: Date;
  business?: Types.ObjectId;
  resetPasswordToken?: string;
  updatedAt?: Date;

  referralCode?: string;
  referredBy?: Types.ObjectId;
  plan?: Types.ObjectId;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    referralCode: {
      type: Schema.Types.String,
      trim: true,
      unique: true,
      sparse: true, // allows null
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allows null
      trim: true,
      select: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    resetPasswordToken: {
      type: Schema.Types.String,
      select: false,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: false,
    },
    role: {
      type: Schema.Types.String,
      required: true,
      default: 'USER',
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ _id: 1, status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
