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
const MessageModel =
  mongoose.models.messages || mongoose.model("messages", DataSchema);

export default MessageModel;
