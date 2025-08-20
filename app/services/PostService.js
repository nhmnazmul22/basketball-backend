import { convertObjectId, removeExistingFile } from "../lib/utility.js";
import PostModel from "../models/PostModel.js";
import TeamModel from "../models/TeamModel.js";
import path from "path";

export const CreatePostService = async (req) => {
  try {
    const body = req.body;
    const { authorName, title, description } = body;

    if (!authorName || !title || !description) {
      return {
        status: 400,
        message: "Missing Required filed",
        data: null,
      };
    }

    const post = await PostModel.create(body);

    if (!post) {
      return {
        status: 500,
        message: "Post create Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: post };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllPostService = async () => {
  try {
    const posts = await PostModel.find({});

    if (posts.length === 0) {
      return { status: 404, message: "Posts not found", data: null };
    }

    return { status: 200, message: "successful", data: posts };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetPostByIdService = async (req) => {
  try {
    const postId = convertObjectId(req.params.postId);

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      return { status: 404, message: "Post not found", data: null };
    }

    return { status: 200, message: "successful", data: post };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdatePostService = async (req) => {
  try {
    const postId = convertObjectId(req.params.postId);
    const body = req.body;
    const { like } = body;
    const existPost = await PostModel.findOne({ _id: postId });

    if (!existPost) {
      return { status: 404, message: "Post not found", data: null };
    }

    let newLike = existPost.like;

    if (like) {
      newLike += like;
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { ...body, like: newLike },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return {
        status: 500,
        message: "Post Update Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: updatedPost };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeletePostService = async (req) => {
  try {
    const postId = convertObjectId(req.params.postId);

    const existPost = await PostModel.findById(postId);

    if (!existPost) {
      return { status: 404, message: "Post not found", data: null };
    }

    const deletePost = await PostModel.findByIdAndDelete(postId);

    if (!deletePost) {
      return { status: 500, message: "Post delete failed", data: null };
    }

    return { status: 200, message: "successful", data: deletePost };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
