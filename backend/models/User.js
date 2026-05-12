import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: { type: String, default: "" },
    favorites: {
      type: [{ type: Schema.Types.ObjectId, ref: "Nanny" }],
      default: [],
    },
    role: {
      type: String,
      enum: ["parent", "nanny"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

export const User = model("User", userSchema);
