import * as GroupServices from "../services/GroupServices.js";

export const CreateGroupController = async (req, res) => {
  const result = await GroupServices.CreateGroupService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllGroupController = async (req, res) => {
  const result = await GroupServices.GetAllGroupService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetGroupByIdController = async (req, res) => {
  const result = await GroupServices.GetGroupByIdService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdateGroupController = async (req, res) => {
  const result = await GroupServices.UpdateGroupService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const DeleteGroupController = async (req, res) => {
  const result = await GroupServices.DeleteGroupService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
