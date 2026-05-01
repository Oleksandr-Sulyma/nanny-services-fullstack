import { Schema, model } from "mongoose";

const nannySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar_url: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: [
      {
        reviewer: {
          type: String,
          required: true,
          trim: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    education: {
      type: String,
      required: true,
      trim: true,
    },
    kids_age: {
      type: String,
      required: true,
      trim: true,
    },
    price_per_hour: {
      type: Number,
      required: true,
      min: 1.0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    characters: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

nannySchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Number((totalRating / this.reviews.length).toFixed(1));
  } else {
    this.rating = 0;
  }
  next();
});

export const Nanny = model("Nanny", nannySchema);
