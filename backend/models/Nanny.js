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
    location: { type: String, default: "" },
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


export const Nanny = model("Nanny", nannySchema);
