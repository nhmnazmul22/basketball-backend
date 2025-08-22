import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["aktif", "tidak aktif"],
      default: "aktif",
    },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TeamModel = mongoose.models.teams || mongoose.model("teams", DataSchema);

export default TeamModel;
