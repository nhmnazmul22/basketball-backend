import UserModel from "../models/UserModel.js";
import {
  sendPushNotification,
  sendAbsentNotifications,
} from "../lib/notification.js";

export const ManualNotificationService = async (req) => {
  const { studentId, message } = req.body;
  try {
    const student = await UserModel.findById(studentId);
    if (!student)
      return {
        status: 404,
        message: "Student not found",
      };

    await sendPushNotification(
      student.expoPushToken,
      "Absent Alert",
      message || "You are marked absent today."
    );

    return {
      status: 200,
      message: "Manually Notification sent successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
    };
  }
};

export const AutomaticNotificationService = async (req) => {
  try {
    await sendAbsentNotifications();
    return {
      status: 200,
      message: "Automatic notifications sent successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
    };
  }
};
