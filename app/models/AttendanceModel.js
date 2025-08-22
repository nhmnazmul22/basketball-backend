import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["hadiah", "absen", "terlambat"],
      required: true,
    },
    gps: { type: Boolean, required: true },
    faceMatch: { type: Boolean, required: true },
    notificationSent: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const AttendanceModel =
  mongoose.models.attendances || mongoose.model("attendances", DataSchema);

export default AttendanceModel;
