import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logout,
  updateAccessToken,
  getUserinfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateAvatar,
  getAllUsers,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logout);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserinfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

userRouter.put("/update-password", isAuthenticated, updatePassword);

userRouter.put("update-avatar", isAuthenticated, updateAvatar);

userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

export default userRouter;
