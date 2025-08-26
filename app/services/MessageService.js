import MessageModel from "../models/MessageModel.js";
import {convertObjectId} from "../lib/utility.js"

export const CreateMessageService = async (messagObj) => {
  try {
    const { message, groupId, senderId } = messagObj;

    if (!message || !groupId || !senderId) {
      return {
        status: 400,
        message: "Missing Required field",
        data: null,
      };
    }

    const messageData = await MessageModel.create(messagObj);

    if (!messageData) {
      return {
        status: 500,
        message: "Message send failed",
        data: null,
      };
    }
  console.log(messageData)
    return {
      status: 200,
      message: "Message send successful",
      data: messageData,
    };
  } catch (err) {}
};

export const GetAllMessageService = async (req)=>{
  try{
    const groupId = convertObjectId(req.params.groupId);
    
    const messages = await MessageModel.aggregate([
      {$match: {groupId: groupId}},
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $unwind: "$senderDetails",
      },
    ]) 



    if(messages.length === 0){
      return {status: 404, message: "Messages not found", data: []};
    }

    return {
      status: 200,
      message: "Messages found",
      data: messages
    }
  }catch(err){
    return { status: 500, message: err.message || "Server issue", data: null };
  }
}