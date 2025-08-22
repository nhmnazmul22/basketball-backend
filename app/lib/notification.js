import fetch from "node-fetch";
import AttendanceModel from "../models/AttendanceModel.js";

export const sendPushNotification = async (expoPushToken, title, body) => {
  if (!expoPushToken) return;

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { type: "attendance" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const sendAbsentNotifications = async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const absentees = await AttendanceModel.find({
    date: today,
    status: "absent",
  }).populate("studentId");

  for (let record of absentees) {
    await sendPushNotification(
      record.studentId.expoPushToken,
      "Absent Alert",
      `You have been marked absent today (${today})`
    );
  }
};
