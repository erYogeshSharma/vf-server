import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Plan';
export const COLLECTION_NAME = 'plans';

export enum PlanCode {
  Basic = 'Basic',
  Premium = 'Premium',
}

export default interface Role {
  _id: Types.ObjectId;
  plan: string;
  user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
}

const schema = new Schema<Role>(
  {
    plan: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(PlanCode),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    expiresAt: {
      type: Schema.Types.Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), //15 days
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ code: 1, status: 1 });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
