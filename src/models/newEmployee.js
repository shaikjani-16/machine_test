import mongoose, { Schema } from "mongoose";

const newEmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    course: {
      type: [String],
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Deactive"],
      default: "Active", // Default value for the 'role' field if not specified during document creation
    },
  },
  { timestamps: true }
);
export const NewEmployee =
  mongoose.models.NewEmployee ||
  mongoose.model("NewEmployee", newEmployeeSchema);
