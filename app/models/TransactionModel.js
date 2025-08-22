import mongoose from "mongoose";

// Define DataSchema
const DataSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    type: { type: String, enum: ["penghasilan", "pengeluaran"], require: true },
    status: {
      type: String,
      enum: ["dibayar", "dibatalkan", "menunggu"],
      default: "dibayar",
    },
    remark: { type: String },
  },
  { versionKey: false, timestamps: true }
);

// Define Model
const TransactionModel =
  mongoose.models.transactions || mongoose.model("transactions", DataSchema);

export default TransactionModel;
