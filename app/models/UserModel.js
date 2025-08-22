import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    profilePicture: { type: String },
    fullName: { type: String, required: true },
    dob: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "murid", "pelatih"], required: true },
    status: {
      type: String,
      enum: ["aktif", "tidak aktif", "sedang cuti"],
      default: "active",
    },
    phone: { type: String },
    faceDescriptor: { type: [Number], default: [] },
    expoPushToken: { type: String },
    teamId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const UserModel = mongoose.models.users || mongoose.model("users", DataSchema);

export default UserModel;
