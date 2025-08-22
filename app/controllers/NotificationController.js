import * as NotificationService from "../services/NotificationService.js";

export const ManualNotificationController = async (req, res) => {
  const result = await NotificationService.ManualNotificationService(req);
  return res.status(result.status).json({ message: result.message });
};

export const AutomaticNotificationController = async (req, res) => {
  const result = await NotificationService.AutomaticNotificationService(req);
  return res.status(result.status).json({ message: result.message });
};
