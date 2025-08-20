import * as AnnouncementServices from "../services/AnnouncementServices.js";

export const CreateAnnouncementController = async (req, res) => {
  const result = await AnnouncementServices.CreateAnnouncementService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllAnnouncementController = async (req, res) => {
  const result = await AnnouncementServices.GetAllAnnouncementService();
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAnnouncementByIdController = async (req, res) => {
  const result = await AnnouncementServices.GetAnnouncementByIdService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdateAnnouncementController = async (req, res) => {
  const result = await AnnouncementServices.UpdateAnnouncementService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const DeleteAnnouncementController = async (req, res) => {
  const result = await AnnouncementServices.DeleteAnnouncementService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
