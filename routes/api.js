import express from "express";
import * as TeamController from "../app/controllers/TeamController.js";
import * as UserController from "../app/controllers/UserController.js";
import { upload } from "../app/middleware/UploadMiddleware.js";

// === Initial Express Router ===
const router = express.Router();

// User Routes
router.post("/create-user", UserController.CreateUserController);
router.post("/login", UserController.LoginUserController);
router.get("/users", UserController.GetAllUserController);
router.get("/user/:userId", UserController.GetUserByIdController);
router.put("/update-user/:userId", UserController.UpdateUserController);
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

export default router;
