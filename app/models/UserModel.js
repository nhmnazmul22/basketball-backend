import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    profilePicture: { type: String },
    fullName: { type: String, required: true },
    dob: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student", "couch"], required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "on leave"],
      default: "active",
    },
    phone: { type: String },
    faceDescriptor: { type: [Number], default: [] },
    teamId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const UserModel = mongoose.models.users || mongoose.model("users", DataSchema);

export default UserModel;
