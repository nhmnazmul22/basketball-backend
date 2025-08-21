import * as AttendanceService from "../services/AttendanceService.js";

export const CreateAttendanceController = async (req, res) => {
  const result = await AttendanceService.CreateAttendanceService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};


export const GetAllAttendanceController = async (req, res) => {
  const result = await AttendanceService.GetAllAttendanceService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};