import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    groupName: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    membersIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TeamModel = mongoose.models.teams || mongoose.model("teams", DataSchema);

export default TeamModel;
