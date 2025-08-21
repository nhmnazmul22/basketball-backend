import { convertObjectId, removeExistingFile } from "../lib/utility.js";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { TokenEncoded } from "../lib/tokenUtility.js";
import path from "path";
import { faceapi, loadModels, canvas } from "../lib/faceApiSetup.js";

export const CreateUserService = async (req) => {
  const body = req.body;
  const image = req.file;
  const { fullName, role, email, password, teamId } = body;
  const imagePath = image ? path.join("uploads/images", image.filename) : null;

  try {
    if (role === "student" && !image) {
      return {
        status: 400,
        message: "User Image required",
        data: null,
      };
    }

    if (!fullName || !role || !email || !password || !teamId) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "Required field missing",
        data: null,
      };
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      removeExistingFile(imagePath);
      return {
        status: 400,
        message: "User already exists",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : null;

    // ✅ Load face-api models
    await loadModels();

    // ✅ Load and process image
    let descriptor = [];
    if (imagePath) {
      const img = await canvas.loadImage(imagePath);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        removeExistingFile(imagePath);
        return {
          status: 400,
          message: "No face detected in uploaded image",
          data: null,
        };
      }

      descriptor = Array.from(detection.descriptor); // store as array in DB
    }

    // ✅ Create user object
    const userObj = {
      ...body,
      profilePicture: imageUrl || "",
      password: hashedPassword,
      faceDescriptor: descriptor, // 🔹 stored for later face matching
    };

    const user = await UserModel.create(userObj);
    if (!user) {
      removeExistingFile(imagePath);
      return { status: 500, message: "User creation failed", data: null };
    }

    const userWithoutPass = user.toObject();
    delete userWithoutPass.password;

    return { status: 200, message: "Successful", data: userWithoutPass };
  } catch (err) {
    console.error("❌ FaceAPI Error:", err);
    removeExistingFile(imagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const LoginUserService = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return {
        status: 400,
        message: "Required field missing, please provide all required field",
        data: null,
      };
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        data: null,
      };
    }

    if (user.status === "inactive" || user.status === "on leave") {
      return {
        status: 400,
        message: "User account is inactive or on leave",
        data: null,
      };
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
      return {
        status: 400,
        message: "Password wrong, please provide right password",
        data: null,
      };
    }

    // Generate JWT Token
    const token = TokenEncoded(user._id, user.email, user.role);

    // Set token in a secure HTTP-only cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return {
      status: 200,
      message: "Login Successful",
      data: token,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};

export const LogOutService = async (req, res) => {
  try {
    res.clearCookie("token");
    return {
      status: 200,
      message: "Logout Successful",
      data: null,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};

export const GetAllUserService = async () => {
  try {
    const users = await UserModel.find({}, { password: 0 });

    if (users.length === 0) {
      return { status: 404, message: "Users not found", data: null };
    }

    return { status: 200, message: "successful", data: users };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const GetUserByIdService = async (req) => {
  try {
    let userId = convertObjectId(req.headers.userId);

    const user = await UserModel.findById(userId, { password: 0 });

    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }

    return { status: 200, message: "successful", data: user };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateUserService = async (req) => {
  const userId = convertObjectId(req.params.userId);
  const body = req.body;
  const image = req.file;
  let imagePath = null;
  const newImagePath = image
    ? path.join("uploads/images", image.filename)
    : null;

  try {
    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      removeExistingFile(newImagePath);
      return { status: 404, message: "User not found", data: null };
    }

    if (existUser.profilePicture) {
      const linkArray = existUser.profilePicture.split("/");
      const fileName = linkArray[linkArray.length - 1];
      imagePath = path.join("uploads/images", fileName);
    }

    const protocol = req.protocol;
    const imageUrl = image
      ? `${protocol}://${req.get("host")}/uploads/images/${image.filename}`
      : existUser.profilePicture;

    // ✅ Load face-api models
    await loadModels();

    // ✅ Load and process image
    let descriptor = existUser.faceDescriptor || [];
    if (newImagePath) {
      const img = await canvas.loadImage(newImagePath);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        removeExistingFile(newImagePath);
        return {
          status: 400,
          message: "No face detected in uploaded image",
          data: null,
        };
      }

      descriptor = Array.from(detection.descriptor); // store as array in DB
    }

    const updateData = {
      ...body,
      profilePicture: imageUrl,
      faceDescriptor: descriptor,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      removeExistingFile(newImagePath);
      return {
        status: 500,
        message: "User update failed",
        data: null,
      };
    }

    const userWithoutPass = updatedUser.toObject();
    delete userWithoutPass.password;

    if (image) {
      removeExistingFile(imagePath);
    }
    return {
      status: 200,
      message: "Successful",
      data: userWithoutPass,
    };
  } catch (err) {
    removeExistingFile(newImagePath);
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeleteUserService = async (req) => {
  try {
    const userId = convertObjectId(req.params.userId);
    console.log(userId);
    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      return { status: 404, message: "User not found", data: null };
    }

    const deletedUser = await UserModel.deleteOne({ _id: userId });

    console.log(deletedUser);
    if (!deletedUser) {
      return { status: 500, message: "User delete failed", data: null };
    }

    return { status: 200, message: "successful", data: deletedUser };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const ForgotUserPasswordService = async (req) => {
  try {
    const { email, prevPassword, newPassword } = req.body;

    if (!email || !prevPassword || !newPassword) {
      return {
        status: 400,
        message: "Required field missing, please provide all required field",
        data: null,
      };
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        data: null,
      };
    }

    if (user.status === "inactive" || user.status === "on leave") {
      return {
        status: 400,
        message: "User account is inactive or on leave",
        data: null,
      };
    }

    const isPasswordOk = await bcrypt.compare(prevPassword, user.password);

    if (!isPasswordOk) {
      return {
        status: 400,
        message: "Previous password is incorrect",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!updatedUser) {
      return {
        status: 500,
        message: "Password Reset failed",
        data: null,
      };
    }

    const userWithoutPass = updatedUser.toObject();
    delete userWithoutPass.password;

    return {
      status: 200,
      message: "Password reset successful",
      data: userWithoutPass,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};
