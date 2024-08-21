import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logout,
  updateAccessToken,
  getUserinfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logout);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserinfo);

export default userRouter;
