import { convertObjectId } from "../lib/utility.js";
import AnnouncementModel from "../models/AnnouncementModel.js";

export const CreateAnnouncementService = async (req) => {
  try {
    const body = req.body;
    const { title, message, date, team } = body;

    if (!title || !message || !date) {
      return {
        status: 400,
        message: "Missing require field",
        data: null,
      };
    }

    const announcement = await AnnouncementModel.create(body);

    if (!announcement) {
      return {
        status: 500,
        message: "announcement create failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: announcement };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllAnnouncementService = async () => {
  try {
    const announcements = await AnnouncementModel.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      {
        $unwind: {
          path: "$teamDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (announcements.length === 0) {
      return { status: 404, message: "Announcements not found", data: null };
    }

    return { status: 200, message: "successful", data: announcements };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAnnouncementByIdService = async (req) => {
  try {
    const announcementId = convertObjectId(req.params.announcementId);

    const announcement = await AnnouncementModel.aggregate([
      { $match: { _id: announcementId } },
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      {
        $unwind: {
          path: "$teamDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (announcement.length === 0) {
      return { status: 404, message: "Announcement not found", data: null };
    }

    return { status: 200, message: "successful", data: announcement[0] };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateAnnouncementService = async (req) => {
  try {
    const announcementId = convertObjectId(req.params.announcementId);
    const body = req.body;
    const existAnnouncement = await AnnouncementModel.findOne({
      _id: announcementId,
    });

    if (!existAnnouncement) {
      return { status: 404, message: "Announcement not found", data: null };
    }

    const updatedAnnouncement = await AnnouncementModel.findOneAndUpdate(
      { _id: announcementId },
      { ...body },
      {
        new: true,
      }
    );

    if (!updatedAnnouncement) {
      return {
        status: 500,
        message: "Announcement update Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: updatedAnnouncement };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeleteAnnouncementService = async (req) => {
  try {
    const announcementId = convertObjectId(req.params.announcementId);

    const existAnnouncement = await AnnouncementModel.findById(announcementId);

    if (!existAnnouncement) {
      return { status: 404, message: "Announcement not found", data: null };
    }

    const deleteAnnouncement = await AnnouncementModel.findByIdAndDelete(
      announcementId
    );

    if (!deleteAnnouncement) {
      return { status: 500, message: "Announcement delete failed", data: null };
    }

    return { status: 200, message: "successful", data: deleteAnnouncement };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
