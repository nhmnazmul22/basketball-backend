import mongoose from "mongoose";
import fs from "fs";

// Convert String id to ObjectId
export const convertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

// Delete existing file
export const removeExistingFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return;
  }
  return;
};
