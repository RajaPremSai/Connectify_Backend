import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { create } from "node:domain";
import { connectToSocket } from "./controllers/SocketManager.js";
import userRoutes from "./routes/users.Routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
const url = process.env.MONGO_URL;

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ hello: "World" });
});

const start = async () => {
  const connectionDB = await mongoose.connect(url);
  console.log(`MONGO Connected DB Host:${connectionDB.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("LISTENING ON PORT 8000");
  });
};

start();
