import express from "express";
import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcom to Subscriptions Tracker API");
});

app.listen(PORT, () => {
  console.log(`The server is running on Port ${PORT}`);
});

export default app;
