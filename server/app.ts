import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "../server/middleware/error";
require("dotenv").config();
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";
import { responseEncoding } from "axios";

// body parser
app.use(express.json({ limit: "1000mb" }));
// app.use(express.json({}));

// cookie parser
app.use(cookieParser());

// cors (cross origin resource sharing)
app.use(
  cors({
    origin: "https://lms-two-omega.vercel.app",
    credentials: true,
  })
);

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15min
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "server is running" });
});

// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);
// app.use("/api/v1", courseRouter);
// app.use("/api/v1", orderRouter);
// testing api

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown route

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
app.use(limiter);
app.use(ErrorMiddleware);
