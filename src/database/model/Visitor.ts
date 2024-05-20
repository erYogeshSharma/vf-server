import { Schema, model, Types } from 'mongoose';
import Business from './Business';

export const DOCUMENT_NAME = 'Visitor';
export const COLLECTION_NAME = 'visits';

export default interface Visitor {
  _id?: Types.ObjectId;
  business: Business;
  ip: string;
  userAgent: string;
  visitedOn: Date;
}

const schema = new Schema<Visitor>(
  {
    ip: {
      type: Schema.Types.String,
      required: true,
    },
    userAgent: {
      type: Schema.Types.String,
      required: false,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    visitedOn: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

schema.index({ category: 1, title: 1 });

export const VisitorModel = model<Visitor>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
