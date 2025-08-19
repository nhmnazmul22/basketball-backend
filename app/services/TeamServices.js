import { convertObjectId, removeExistingFile } from "../lib/utility.js";
import TeamModel from "../models/TeamModel.js";
import path from "path";

export const CreateTeamService = async (req) => {
  try {
    const image = req.file;
    const body = req.body;
    const { name } = body;
    const imagePath = image
      ? path.join("uploads/images", image.filename)
      : null;

    if (!image) {
      return {
        status: 400,
        message: "Team logo or image required",
        data: null,
      };
    }

    if (!name) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "Team name required",
        data: null,
      };
    }

    // const protocol = req.protocol === "http" ? "https" : req.protocol;
    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : null;

    const team = await TeamModel.create({
      logo: imageUrl,
      ...body,
    });

    if (!team) {
      removeExistingFile(imagePath);
      return {
        status: 500,
        message: "Team create Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: team };
  } catch (err) {
    removeExistingFile(imagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllTeamService = async () => {
  try {
    const teams = await TeamModel.find({});

    if (teams.length === 0) {
      return { status: 404, message: "Teams not found", data: null };
    }

    return { status: 200, message: "successful", data: teams };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetTeamByIdService = async (req) => {
  try {
    const teamId = convertObjectId(req.params.teamId);

    if (!teamId) {
      return { status: 404, message: "Team not found", data: null };
    }

    const team = await TeamModel.findOne({ _id: teamId });

    if (!team) {
      return { status: 404, message: "Team not found", data: null };
    }

    return { status: 200, message: "successful", data: team };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateTeamService = async (req) => {
  const teamId = convertObjectId(req.params.teamId);
  const image = req.file;
  const body = req.body;
  let imagePath = null;
  const newImagePath = image
    ? path.join("uploads/images", image.filename)
    : null;

  try {
    const prevTeam = await TeamModel.findOne({ _id: teamId });

    if (!prevTeam) {
      removeExistingFile(newImagePath);
      return { status: 404, message: "Team not found", data: null };
    }

    if (prevTeam.logo) {
      const linkArray = prevTeam.logo.split("/");
      const fileName = linkArray[linkArray.length - 1];
      imagePath = path.join("uploads/images", fileName);
    }

    // const protocol = req.protocol === "http" ? "https" : req.protocol;
    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : prevTeam.logo;

    const updateObj = {
      ...body,
      logo: imageUrl,
    };

    const team = await TeamModel.findOneAndUpdate({ _id: teamId }, updateObj, {
      new: true,
    });

    if (!team) {
      removeExistingFile(newImagePath);
      return {
        status: 500,
        message: "Team create Failed",
        data: null,
      };
    }

    if (image) {
      removeExistingFile(imagePath);
    }
    return { status: 200, message: "Successful", data: team };
  } catch (err) {
    removeExistingFile(newImagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeleteTeamService = async (req) => {
  try {
    const teamId = convertObjectId(req.params.teamId);
    let imagePath = null;

    if (!teamId) {
      return { status: 404, message: "Team not found", data: null };
    }

    const prevTeam = await TeamModel.findById(teamId);

    if (!prevTeam) {
      return { status: 404, message: "Team not found", data: null };
    }

    if (prevTeam.logo) {
      const linkArray = prevTeam.logo.split("/");
      const fileName = linkArray[linkArray.length - 1];
      imagePath = path.join("uploads/images", fileName);
    }

    const deleteTeam = await TeamModel.findByIdAndDelete(teamId);

    if (!deleteTeam) {
      return { status: 500, message: "Team delete failed", data: null };
    }

    removeExistingFile(imagePath);
    return { status: 200, message: "successful", data: deleteTeam };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
