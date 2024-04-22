import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Link';
export const COLLECTION_NAME = 'links';

export default interface Link {
  _id?: Types.ObjectId;
  title: string;
  category: string;
  isActive: boolean;
  icon: string;
  createdBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
  isMaster?: boolean;
}
const test = 'true';
const schema = new Schema<Link>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    icon: {
      type: Schema.Types.String,
      required: false,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    isMaster: {
      type: Schema.Types.Boolean,
      required: true,
      //TODO: change this to false by default
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ category: 1, title: 1 });

export const LinkModel = model<Link>(DOCUMENT_NAME, schema, COLLECTION_NAME);
