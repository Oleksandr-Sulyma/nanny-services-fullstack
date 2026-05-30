import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nannyId: {
      type: Schema.Types.ObjectId,
      ref: "Nanny",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
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

reviewSchema.index(
  { appointmentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      appointmentId: { $type: "objectId" },
    },
  },
);

export const Review = model("Review", reviewSchema);
