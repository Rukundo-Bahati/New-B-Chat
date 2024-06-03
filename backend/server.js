import EventEmitter from 'events';
EventEmitter.EventEmitter.defaultMaxListeners = 5;

import path from "path";
import express from "express";
import  config  from "config";
import cors from 'cors'
import cookieParser from "cookie-parser";

import debug from 'debug';
const log = debug('mychat');

app.use(cors({ origin: 'http://localhost:3000' }));
const __dirname = path.resolve();
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connection.js";
import { app, server } from "./socket/socket.js";

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
const PORT = config.get("PORT") || 5200;

server.listen(PORT, () => {
	connectToMongoDB();
	log(`Server Running on port ${PORT}`);
});
