import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TeamModel = mongoose.models.teams || mongoose.model("teams", DataSchema);

export default TeamModel;
