import { startSession } from "mongoose";
import User from "../models/userModel.js";
import CustomError from "../middleware/customerror.js";
import { genSalt, hash, compare } from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

const signUp = async (req, res, next) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: user[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "User signed up successfully",
      data: { token, user: user[0] },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("No account found", 404);
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new CustomError("Incorrect password", 401);
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookies("");
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, signOut };
