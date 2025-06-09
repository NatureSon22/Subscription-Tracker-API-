import { NODE_ENV } from "../config/env.js";
import CustomError from "./customerror.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ✅ Preserve CustomError details
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ✅ Mongoose - CastError (invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found!";
  }

  // ✅ Mongoose - Duplicate key
  else if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    statusCode = 400;
    message = `Duplicate value for ${field}: ${value}`;
  }

  // ✅ Mongoose - Validation error
  else if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
    message = messages.join(", ");
  }

  const errorResponse = {
    success: false,
    message,
  };

  if (NODE_ENV === "development") {
    errorResponse.stack = err.stack;
    errorResponse.originalError = err;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorMiddleware;
