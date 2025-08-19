import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    profilePicture: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "on leave"],
      default: "active",
    },
    phone: { type: String },
    teamId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const UserModel = mongoose.models.users || mongoose.model("users", DataSchema);

export default UserModel;
