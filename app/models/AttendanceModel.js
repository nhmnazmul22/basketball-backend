import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    team: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    gps: { type: Boolean, required: true },
    faceMath: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const AttendanceModel =
  mongoose.models.attendances || mongoose.model("attendances", DataSchema);

export default AttendanceModel;
