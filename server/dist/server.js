"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socketServer_1 = require("./socketServer");
require("dotenv").config();
const db_1 = __importDefault(require("./utils/db"));
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app_1.app);
// cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
(0, socketServer_1.initSocketServer)(server);
// create server
server.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    (0, db_1.default)();
});
