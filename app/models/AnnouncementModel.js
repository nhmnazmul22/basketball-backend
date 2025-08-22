import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["aktif", "arsip"],
      default: "aktif",
    },
    isPinned: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const AnnouncementModel =
  mongoose.models.announcements || mongoose.model("announcements", DataSchema);

export default AnnouncementModel;
