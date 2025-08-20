import * as PostServices from "../services/PostService.js";

export const CreatePostController = async (req, res) => {
  const result = await PostServices.CreatePostService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetAllPostController = async (req, res) => {
  const result = await PostServices.GetAllPostService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const GetPostByIdController = async (req, res) => {
  const result = await PostServices.GetPostByIdService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const UpdatePostController = async (req, res) => {
  const result = await PostServices.UpdatePostService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const DeletePostController = async (req, res) => {
  const result = await PostServices.DeletePostService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};
