import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nannyId: { type: Schema.Types.ObjectId, ref: "Nanny", required: true },
    parentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    childAge: { type: String, required: true },
    time: { type: String, required: true },
    comment: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
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

export const Appointment = model("Appointment", appointmentSchema);
