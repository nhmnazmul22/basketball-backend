import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    team: { type: String, required: true },
    amount: { type: String, required: true },
    method: { type: Boolean, required: true },
    type: { type: String, enum: ["Income", "Expense"], require: true },
    status: {
      type: String,
      enum: ["Paid", "Cancel", "Pending"],
      required: true,
    },
    date: { type: Date, required: true },
    remark: { type: String },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TransactionModel =
  mongoose.models.transactions || mongoose.model("transactions", DataSchema);

export default TransactionModel;
