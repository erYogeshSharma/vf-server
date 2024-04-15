import { Schema, model, Types } from 'mongoose';
export const DOCUMENT_NAME = 'Business';
export const COLLECTION_NAME = 'businesses';

export default interface Business {
  _id: Types.ObjectId;
  linkId: string;
  name: string;
  title: string;
  description: string;
  logo: string;
  coverImage: string;
  email: string;
  phone: number;
  alternatePhone: number;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: number;
  industry: string;

  isActive: boolean;

  enableEnquiryForm: boolean;
  enableAppointmentForm: boolean;

  links: {
    type: Types.ObjectId;
    link: string;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Business>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    logo: {
      type: Schema.Types.String,
      required: true,
    },
    coverImage: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.Number,
      required: true,
    },

    alternatePhone: {
      type: Schema.Types.Number,
      required: true,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    country: {
      type: Schema.Types.String,
      required: true,
    },
    city: {
      type: Schema.Types.String,
      required: true,
    },
    state: {
      type: Schema.Types.String,
      required: true,
    },
    zipCode: {
      type: Schema.Types.Number,
      required: true,
    },
    industry: {
      type: Schema.Types.String,
      required: true,
    },

    isActive: {
      type: Schema.Types.Boolean,
      required: true,
    },
    enableEnquiryForm: {
      type: Schema.Types.Boolean,
      required: true,
    },
    enableAppointmentForm: {
      type: Schema.Types.Boolean,
      required: true,
    },

    links: [
      {
        type: {
          type: Schema.Types.ObjectId,
          ref: 'Link',
        },
        link: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
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
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ code: 1, status: 1 });

export const RoleModel = model<Business>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
