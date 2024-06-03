import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Customer Feedback';
export const COLLECTION_NAME = 'feedbacks';

export default interface Feedback {
  _id?: Types.ObjectId;
  message: string;
  user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Feedback>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ user: 1 });

export const FeedbackModel = model<Feedback>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
