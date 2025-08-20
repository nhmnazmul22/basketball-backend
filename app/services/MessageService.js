import MessageModel from "../models/MessageModel";

export const SendMessageService = async (req) => {
  try {
    const body = req.body;
    const { message, groupId, senderId } = body;

    if (!message || !groupId || !senderId) {
      return {
        status: 400,
        message: "Missing Required field",
        data: null,
      };
    }

    const messageData = await MessageModel.create(body);

    if (!messageData) {
      return {
        status: 500,
        message: "Message send failed",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Message send successful",
      data: messageData,
    };
  } catch (err) {}
};
