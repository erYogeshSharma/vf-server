import { Schema, model, Types } from 'mongoose';
export const DOCUMENT_NAME = 'Business';
export const COLLECTION_NAME = 'businesses';

export default interface Business {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;

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
  googleMapLink?: string;

  address?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: number;

  enableEnquiryForm?: boolean;
  enableAppointmentForm?: boolean;
  theme: string;

  gallery?: string[];
  products?: {
    title: string;
    image: string;
    description?: string;
  }[];

  links?: {
    type: Types.ObjectId;
    link: string;
  }[];

  calender: string;

  isActive?: boolean;
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
    },
    description: {
      type: Schema.Types.String,
    },
    googleMapLink: {
      type: Schema.Types.String,
    },
    logo: {
      type: Schema.Types.String,
      required: true,
    },
    coverImage: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
    },
    phone: {
      type: Schema.Types.Number,
    },

    alternatePhone: {
      type: Schema.Types.Number,
    },
    linkId: {
      type: Schema.Types.String,
      required: true,
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

    theme: {
      type: Schema.Types.String,
      default: 'light',
    },
    products: [
      {
        title: {
          type: Schema.Types.String,
        },
        image: {
          type: Schema.Types.String,
        },
        description: {
          type: Schema.Types.String,
        },
      },
    ],

    calender: {
      type: Schema.Types.String,
      default: `{"mon":"T-09:00 AM-10:00 PM","tue":"T-09:00 AM-10:00 PM","wed":"T-09:00 AM-10:00 PM","thu":"T-09:00 AM-10:00 PM","fri":"T-09:00 AM-10:00 PM","sat":"T-09:00 AM-10:00 PM","sun":"T-09:00 AM-10:00 PM"}`,
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
