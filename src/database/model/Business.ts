import { Schema, model, Types } from 'mongoose';
import User from './User';
export const DOCUMENT_NAME = 'Business';
export const COLLECTION_NAME = 'businesses';

export default interface Business {
  _id?: Types.ObjectId;
  user?: User;

  linkId: string;
  name: string;
  title: string;
  category: string;
  description: string;
  logo: string;
  coverImage: string;
  email: string;
  phone: number;
  alternatePhone?: number;

  address?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  industry?: string;

  enableEnquiryForm?: boolean;
  enableAppointmentForm?: boolean;

  gallery?: string[];
  products?: {
    title: string;
    image: string;
  }[];

  links?: {
    type: Types.ObjectId;
    link: string;
  }[];

  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Business>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.String,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
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
    },
    address: {
      type: Schema.Types.String,
    },
    country: {
      type: Schema.Types.String,
    },
    city: {
      type: Schema.Types.String,
    },
    state: {
      type: Schema.Types.String,
    },
    zipCode: {
      type: Schema.Types.Number,
    },
    industry: {
      type: Schema.Types.String,
    },

    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },

    enableEnquiryForm: {
      type: Schema.Types.Boolean,
      default: true,
    },
    enableAppointmentForm: {
      type: Schema.Types.Boolean,
      default: true,
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
    gallery: [
      {
        type: Schema.Types.String,
        required: false,
      },
    ],

    products: [
      {
        title: {
          type: Schema.Types.String,
        },
        image: {
          type: Schema.Types.String,
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

export const BusinessModel = model<Business>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
