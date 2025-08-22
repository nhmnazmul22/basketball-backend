import * as TransactionService from "../services/TransactionService.js";

export const CreateTransactionController = async (req, res) => {
  const result = await TransactionService.CreateTransactionService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllTransactionController = async (req, res) => {
  const result = await TransactionService.GetAllTransactionsService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdateTransactionController = async (req, res) => {
  const result = await TransactionService.UpdateTransactionService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
