import { app } from "./app";
import { initSocketServer } from "./socketServer";
require("dotenv").config();
import connectDb from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";

const server = http.createServer(app);
// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
initSocketServer(server);

// create server
server.listen(process.env.PORT, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
  connectDb();
});
