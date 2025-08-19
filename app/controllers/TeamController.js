import * as TeamServices from "../services/TeamServices.js";

export const CreateTeamController = async (req, res) => {
  const result = await TeamServices.CreateTeamService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllTeamController = async (req, res) => {
  const result = await TeamServices.GetAllTeamService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetTeamByIdController = async (req, res) => {
  const result = await TeamServices.GetTeamByIdService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdateTeamController = async (req, res) => {
  const result = await TeamServices.UpdateTeamService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const DeleteTeamController = async (req, res) => {
  const result = await TeamServices.DeleteTeamService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
