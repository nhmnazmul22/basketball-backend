import { convertObjectId, removeExistingFile } from "../lib/utility.js";
import GroupModel from "../models/GroupModel.js";
import path from "path";

export const CreateGroupService = async (req) => {
  const image = req.file;
  const body = req.body;
  const { groupName, membersIds } = body;
  const imagePath = image ? path.join("uploads/images", image.filename) : null;

  try {
    if (!image) {
      return {
        status: 400,
        message: "Group logo or image required",
        data: null,
      };
    }

    if (!groupName || !membersIds) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "Group name and group members required",
        data: null,
      };
    }

    // const protocol = req.protocol === "http" ? "https" : req.protocol;
    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : null;

    const group = await GroupModel.create({
      logo: imageUrl,
      ...body,
    });

    if (!group) {
      removeExistingFile(imagePath);
      return {
        status: 500,
        message: "Group create Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: group };
  } catch (err) {
    removeExistingFile(imagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllGroupService = async () => {
  try {
    const groups = await GroupModel.find({});

    if (groups.length === 0) {
      return { status: 404, message: "Groups not found", data: null };
    }

    return { status: 200, message: "successful", data: groups };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetGroupByIdService = async (req) => {
  try {
    const groupId = convertObjectId(req.params.groupId);

    const group = await GroupModel.findOne({ _id: groupId });

    if (!group) {
      return { status: 404, message: "Group not found", data: null };
    }

    return { status: 200, message: "successful", data: group };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateGroupService = async (req) => {
  const groupId = convertObjectId(req.params.groupId);
  const image = req.file;
  const body = req.body;
  const { membersIds } = body;
  let imagePath = null;
  const newImagePath = image
    ? path.join("uploads/images", image.filename)
    : null;

  try {
    const existGroup = await GroupModel.findOne({ _id: groupId });

    if (!existGroup) {
      removeExistingFile(newImagePath);
      return { status: 404, message: "Group not found", data: null };
    }

    if (existGroup.logo) {
      const linkArray = existGroup.logo.split("/");
      const fileName = linkArray[linkArray.length - 1];
      imagePath = path.join("uploads/images", fileName);
    }

    // const protocol = req.protocol === "http" ? "https" : req.protocol;
    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : existGroup.logo;

    let newMemberIds = existGroup.membersIds;
    
    if (membersIds) {
      const uniqueMemberIds = Array(membersIds).filter((memberId) =>
        existGroup.membersIds.includes(memberId) ? null : memberId
      );
      newMemberIds.push(uniqueMemberIds);
    }

    const updateObj = {
      ...body,
      logo: imageUrl,
      membersIds: newMemberIds,
    };

    const updateGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      updateObj,
      {
        new: true,
      }
    );

    if (!updateGroup) {
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
    return { status: 200, message: "Successful", data: updateGroup };
  } catch (err) {
    removeExistingFile(newImagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeleteGroupService = async (req) => {
  try {
    const groupId = convertObjectId(req.params.groupId);
    let imagePath = null;

    const existGroup = await GroupModel.findById(groupId);

    if (!existGroup) {
      return { status: 404, message: "Group not found", data: null };
    }

    if (existGroup.logo) {
      const linkArray = existGroup.logo.split("/");
      const fileName = linkArray[linkArray.length - 1];
      imagePath = path.join("uploads/images", fileName);
    }

    const deletedGroup = await GroupModel.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return { status: 500, message: "Group delete failed", data: null };
    }

    if (imagePath) {
      removeExistingFile(imagePath);
    }
    return { status: 200, message: "successful", data: deletedGroup };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
