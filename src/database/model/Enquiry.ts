import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Enquiry';
export const COLLECTION_NAME = 'enquiries';

export default interface Enquiry {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  contact: number;
  message: string;
  business?: Types.ObjectId;
  isSolved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Enquiry>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: false,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    message: {
      type: Schema.Types.String,
      required: false,
    },
    contact: {
      type: Schema.Types.Number,
      required: false,
    },
    isSolved: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ business: 1 });

export const EnquiryModel = model<Enquiry>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
