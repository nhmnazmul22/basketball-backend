import express from "express";
import * as TeamController from "../app/controllers/TeamController.js";
import { upload } from "../app/middleware/UploadMiddleware.js";
// === Initial Express Router ===
const router = express.Router();

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
