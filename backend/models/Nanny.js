import { Schema, model } from "mongoose";

const nannySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    avatar_url: { type: String, default: "" },
    birthday: { type: Date },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    kids_age: { type: String, default: "" },
    price_per_hour: { type: Number, default: 0 },
    location: {
      country: {
        type: String,
        trim: true,
        lowercase: true,
        default: "ukraine",
      },
      region: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
      settlement: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },
    about: { type: String, default: "" },
    characters: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    isProfileComplete: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

nannySchema.index({ isProfileComplete: 1, name: 1 });
nannySchema.index({ isProfileComplete: 1, rating: -1, name: 1 });
nannySchema.index({ isProfileComplete: 1, price_per_hour: -1, name: 1 });
nannySchema.index({
  isProfileComplete: 1,
  "location.region": 1,
  name: 1,
});

export const Nanny = model("Nanny", nannySchema);
