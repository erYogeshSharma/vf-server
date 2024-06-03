import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Offer';
export const COLLECTION_NAME = 'offers';

export default interface Offer {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  startsOn: Date;
  endsOn: Date;
  business: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Offer>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    image: {
      type: Schema.Types.String,
      required: false,
    },
    startsOn: {
      type: Schema.Types.Date,
      required: true,
    },
    endsOn: {
      type: Schema.Types.Date,
      required: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },

    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ category: 1, title: 1 });

export const OfferModel = model<Offer>(DOCUMENT_NAME, schema, COLLECTION_NAME);
