import * as MessageService from "../services/MessageService.js";

export const GetAllMessageController = async (req, res) => {
  const result = await MessageService.GetAllMessageService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
