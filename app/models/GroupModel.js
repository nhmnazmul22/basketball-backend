import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    groupName: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["aktif", "tidak aktif"],
      default: "aktif",
    },
    membersIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const GroupModel =
  mongoose.models.groups || mongoose.model("groups", DataSchema);

export default GroupModel;
