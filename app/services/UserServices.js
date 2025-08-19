import { convertObjectId } from "../lib/utility.js";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { TokenEncoded } from "../lib/tokenUtility.js.js";

export const CreateUserService = async (req) => {
  try {
    const body = req.body;
    const { profilePicture, fullName, role, email, password, teamId } = body;

    if (
      !profilePicture ||
      !fullName ||
      !role ||
      !email ||
      !password ||
      !teamId
    ) {
      return {
        status: 400,
        message: "Required field missing, please provide all required field",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userObj = {
      ...body,
      password: hashedPassword,
    };

    const user = await UserModel.create(userObj);

    if (!user) {
      return {
        status: 500,
        message: "User create Failed",
        data: null,
      };
    }

    return { status: 200, message: "Successful", data: user };
  } catch (err) {
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
    const userId = convertObjectId(req.headers.userId);

    const user = await UserModel.findById(userId);

    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }

    return { status: 200, message: "successful", data: user };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const UpdateUserService = async (req) => {
  try {
    const userId = convertObjectId(req.headers.userId);
    const body = req.body;

    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      return { status: 404, message: "User not found", data: null };
    }

    const updateData = { ...body };
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return {
        status: 500,
        message: "User update failed",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Successful",
      data: updatedUser,
    };
  } catch (err) {
    return { status: 500, message: err.message || "Server issue", data: null };
  }
};

export const DeleteUserService = async (req) => {
  try {
    const userId = convertObjectId(req.headers.userId);

    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      return { status: 404, message: "User not found", data: null };
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

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
    return {
      status: 200,
      message: "Password reset successful",
      data: updatedUser,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};
