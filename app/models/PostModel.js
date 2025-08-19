import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    like: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const PostModel = mongoose.models.posts || mongoose.model("posts", DataSchema);

export default PostModel;
