import TransactionModel from "../models/TransactionModel.js";
import { convertObjectId } from "../lib/utility.js";

export const CreateTransactionService = async (req) => {
  try {
    const body = req.body;
    const { studentId, amount, type, method } = body;

    if (!studentId || !amount || !type || !method) {
      return { status: 400, message: "Missing required fields", data: null };
    }

    const newTransaction = await TransactionModel.create(body);

    if (!newTransaction) {
      return {
        status: 500,
        message: "Failed to create transaction",
        data: null,
      };
    }

    return {
      status: 201,
      message: "Transaction created successfully",
      data: newTransaction,
    };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllTransactionsService = async () => {
  try {
    const transactions = await TransactionModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "studentInfo.password": 0,
          "studentInfo.faceDescriptor": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (transactions.length === 0) {
      return { status: 404, message: "No transactions found", data: [] };
    }

    return {
      status: 200,
      message: "Transactions retrieved successfully",
      data: transactions,
    };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateTransactionService = async (req) => {
  try {
    const transactionId = convertObjectId(req.params.transactionId);
    const updateData = req.body;

    const existTransaction = await TransactionModel.findById(transactionId);

    if (!existTransaction) {
      return {
        status: 404,
        message: "Transaction not found",
        data: null,
      };
    }

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      transactionId,
      updateData,
      { new: true }
    );

    return {
      status: 200,
      message: "Transaction update successful",
      data: updatedTransaction,
    };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
