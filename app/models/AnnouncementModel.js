import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["Active", "Archive"],
      default: "Active",
      required: true,
    },
    isPinned: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TransactionModel =
  mongoose.models.transactions || mongoose.model("transactions", DataSchema);

export default TransactionModel;
