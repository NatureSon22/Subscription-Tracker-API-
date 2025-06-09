import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import subscriptionRouter from "./routes/subscriptionRouter.js";
import connectToDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcom to Subscriptions Tracker API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`The server is running on Port ${PORT}`);

  await connectToDB();
});

export default app;
