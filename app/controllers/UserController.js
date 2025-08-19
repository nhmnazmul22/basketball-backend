import * as UserServices from "../services/UserServices.js";

export const CreateUserController = async (req, res) => {
  const result = await UserServices.CreateUserService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const LoginUserController = async (req, res) => {
  const result = await UserServices.LoginUserService(req, res);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllUserController = async (req, res) => {
  const result = await UserServices.GetAllUserService();
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetUserByIdController = async (req, res) => {
  const result = await UserServices.GetUserByIdService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdateUserController = async (req, res) => {
  const result = await UserServices.UpdateUserService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const DeleteUserController = async (req, res) => {
  const result = await UserServices.DeleteUserService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const ForgotUserPasswordController = async (req, res) => {
  const result = await UserServices.ForgotUserPasswordService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
