import express from "express";
import * as TeamController from "../app/controllers/TeamController.js";
import * as UserController from "../app/controllers/UserController.js";
import * as AttendanceController from "../app/controllers/AttendanceController.js";
import * as AnnouncementController from "../app/controllers/AnnouncementController.js";
import * as GroupController from "../app/controllers/GroupController.js";
import * as PostController from "../app/controllers/PostController.js";
import * as ReportController from "../app/controllers/ReportController.js";
import * as NotificationController from "../app/controllers/NotificationController.js";
import * as TransactionController from "../app/controllers/TransactionController.js";
import { upload } from "../app/middleware/UploadMiddleware.js";
import { AuthVerify } from "../app/middleware/AuthMiddleware.js";

// === Initial Express Router ===
const router = express.Router();

// User Routes
router.post(
  "/create-user",
  upload.single("image"),
  UserController.CreateUserController
);
router.post("/login", UserController.LoginUserController);
router.post("/logout", UserController.LogoutController);
router.get("/users", UserController.GetAllUserController);
router.get("/user-by-id", AuthVerify, UserController.GetUserByIdController);
router.put(
  "/update-user/:userId",
  upload.single("image"),
  UserController.UpdateUserController
);
router.delete("/delete-user/:userId", UserController.DeleteUserController);
router.post("/forgot-password", UserController.ForgotUserPasswordController);

// Team Routes
router.post(
  "/create-team",
  upload.single("image"),
  TeamController.CreateTeamController
);
router.get("/teams", TeamController.GetAllTeamController);
router.get("/teams/:teamId", TeamController.GetTeamByIdController);
router.put(
  "/update-team/:teamId",
  upload.single("image"),
  TeamController.UpdateTeamController
);
router.delete("/delete-team/:teamId", TeamController.DeleteTeamController);

// Attendance Route
router.post(
  "/create-attendance",
  upload.single("image"),
  AttendanceController.CreateAttendanceController
);
router.get("/attendances", AttendanceController.GetAllAttendanceController);

// Announcement Routes
router.post(
  "/create-announcement",
  AnnouncementController.CreateAnnouncementController
);
router.get(
  "/announcements",
  AnnouncementController.GetAllAnnouncementController
);
router.get(
  "/announcements/:announcementId",
  AnnouncementController.GetAnnouncementByIdController
);
router.put(
  "/update-announcement/:announcementId",
  AnnouncementController.UpdateAnnouncementController
);
router.delete(
  "/delete-announcement/:announcementId",
  AnnouncementController.DeleteAnnouncementController
);

// Group Routes
router.post(
  "/create-group",
  upload.single("image"),
  GroupController.CreateGroupController
);
router.get("/groups", GroupController.GetAllGroupController);
router.get("/groups/:groupId", GroupController.GetGroupByIdController);
router.put(
  "/update-group/:groupId",
  upload.single("image"),
  GroupController.UpdateGroupController
);
router.delete("/delete-group/:groupId", GroupController.DeleteGroupController);

// Post Routes
router.post("/create-post", PostController.CreatePostController);
router.get("/posts", PostController.GetAllPostController);
router.get("/posts/:postId", PostController.GetPostByIdController);
router.put("/update-post/:postId", PostController.UpdatePostController);
router.delete("/delete-post/:postId", PostController.DeletePostController);

// Report Routes
router.get("/dashboard-report", ReportController.DashboardReportController);
router.post("/report", ReportController.ReportController);
router.post("/generate-pdf-report", ReportController.ReportPDFController);

// Notification Routes
router.post(
  "/manual-notification",
  NotificationController.ManualNotificationController
);
router.post(
  "/automatic-notification",
  NotificationController.AutomaticNotificationController
);

// Transaction Routes
router.post(
  "/create-transaction",
  TransactionController.CreateTransactionController
);
router.get("/transactions", TransactionController.GetAllTransactionController);
router.put(
  "/update-transaction/:transactionId",
  TransactionController.UpdateTransactionController
);

export default router;
