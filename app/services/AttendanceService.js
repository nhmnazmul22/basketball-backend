import { convertObjectId, removeExistingFile } from "../lib/utility.js";
import path from "path";
import { faceapi, loadModels, canvas } from "../lib/faceApiSetup.js";
import UserModel from "../models/UserModel.js";
import AttendanceModel from "../models/AttendanceModel.js";

export const CreateAttendanceService = async (req) => {
  const image = req.file;
  const imagePath = image ? path.join("uploads/images", image.filename) : null;

  try {
    if (!image) {
      return {
        status: 400,
        message: "Student image required",
        data: null,
      };
    }

    if (!imagePath) {
      return {
        status: 404,
        message: "Image path not found",
        data: null,
      };
    }
    // ✅ Load face-api models
    await loadModels();

    const img = await canvas.loadImage(imagePath);
    const attendanceDetection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!attendanceDetection) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "No face detected in uploaded image",
        data: null,
      };
    }

    const students = await UserModel.find({ role: "student" });

    let matchFound = null;
    const threshold = 0.6;

    students.forEach((student) => {
      const distance = faceapi.euclideanDistance(
        attendanceDetection.descriptor,
        student.faceDescriptor
      );
      if (distance < threshold) matchFound = student;
    });

    if (!matchFound) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "Face not match",
        data: null,
      };
    }

    const attendanceObj = {
      studentId: matchFound._id,
      teamId: matchFound.teamId,
      status: "present",
      gps: true,
      faceMatch: true,
    };

    const attendance = await AttendanceModel.create(attendanceObj);

    if (!attendance) {
      removeExistingFile(imagePath);
      return {
        status: 500,
        message: "Face match, But server issue",
        data: null,
      };
    }

    removeExistingFile(imagePath);
    return {
      status: 200,
      message: "Face match successfully",
      data: attendance,
    };
  } catch (err) {
    removeExistingFile(imagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetAllAttendanceService = async (req) => {
  try {
    const attendances = await AttendanceModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      {
        $unwind: "$studentDetails",
      },
      {
        $unwind: "$teamDetails",
      },
      {
        $project: {
          _id: 1,
          studentId: 1,
          teamId: 1,
          status: 1,
          gps: 1,
          faceMatch: 1,
          studentName: "$studentDetails.name",
          studentEmail: "$studentDetails.email",
          teamName: "$teamDetails.name",
        },
      },
    ]);

    if (attendances.length === 0) {
      return {
        status: 404,
        message: "No attendance records found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Attendance records found",
      data: attendances,
    };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};
