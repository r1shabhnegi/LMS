"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateAvatar = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserinfo = exports.updateAccessToken = exports.logout = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
require("dotenv").config();
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            yield (0, sendMails_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = yield user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        const user = yield user_model_1.default.create({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email and password", 400));
        }
        const isPasswordMatch = yield user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email and password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// logout
exports.logout = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
        redis_1.redis.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.default("Refresh token not provided", 400));
        }
        const refreshSecret = process.env.REFRESH_TOKEN;
        const accessSecret = process.env.ACCESS_TOKEN;
        if (!refreshSecret || !accessSecret) {
            return next(new ErrorHandler_1.default("Server configuration error", 500));
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refresh_token, refreshSecret);
        }
        catch (error) {
            return next(new ErrorHandler_1.default("Invalid refresh token", 401));
        }
        const session = yield redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Please log in to access this resource", 401));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, accessSecret, {
            expiresIn: "5m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, refreshSecret, {
            expiresIn: "3d",
        });
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        // Update Redis session
        yield redis_1.redis.set(user._id, JSON.stringify(user), "EX", 259200); // 3 days
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// export const updateAccessToken = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const refresh_token = req.cookies.refresh_token as string;
//       const decoded = jwt.verify(
//         refresh_token,
//         process.env.REFRESH_TOKEN as string
//       ) as JwtPayload;
//       const message = "Could not refresh token";
//       if (!decoded) {
//         return next(new ErrorHandler(message, 400));
//       }
//       const session = await redis.get(decoded.id as string);
//       if (!session) {
//         return next(
//           new ErrorHandler("Please login for access this resources", 400)
//         );
//       }
//       const user = JSON.parse(session);
//       const accessToken = jwt.sign(
//         { id: user._id },
//         process.env.ACCESS_TOKEN as string,
//         {
//           expiresIn: "5m",
//         }
//       );
//       const refreshToken = jwt.sign(
//         { id: user._id },
//         process.env.REFRESH_TOKEN as string,
//         {
//           expiresIn: "3d",
//         }
//       );
//       req.user = user;
//       res.cookie("access_token", accessToken, accessTokenOptions);
//       res.cookie("refresh_token", refreshToken, refreshTokenOptions);
//       await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
//       // res.status(200).json({
//       //   status: "success",
//       //   accessToken,
//       // });
//       next();
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
// get user info
exports.getUserinfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = yield user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
        const user = yield user_model_1.default.findById(userId);
        // if (email && user) {
        //   const isEmailExist = await userModel.findOne({ email });
        //   if (isEmailExist) {
        //     return next(new ErrorHandler("Email already exist", 400));
        //   }
        //   user.email = email;
        // }
        if (name && user) {
            user.name = name;
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.updatePassword = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password", 400));
        }
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("+password");
        if ((user === null || user === void 0 ? void 0 : user.password) === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isPasswordMatch = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        user.password = newPassword;
        yield user.save();
        if ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)
            yield redis_1.redis.set((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.updateAvatar = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const { avatar } = req.body;
        // const userId = req.user?._id;
        // const user = await userModel.findById(userId);
        // if (avatar && user) {
        //   if (user?.avatar?.public_id) {
        //     // delete old image if have
        //     await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        //     const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //       folder: "avatars",
        //       width: 150,
        //     });
        //     user.avatar = {
        //       public_id: myCloud.public_id,
        //       url: myCloud.secure_url,
        //     };
        //   } else {
        //     const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //       folder: "avatars",
        //       width: 150,
        //     });
        //     user.avatar = {
        //       public_id: myCloud.public_id,
        //       url: myCloud.secure_url,
        //     };
        //   }
        // }
        // await user?.save();
        // userId && (await redis.set(userId, JSON.stringify(user)));
        // res.status(200).json({
        //   success: true,
        //   user,
        // });
        const { avatar } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        if (avatar) {
            if ((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.public_id) {
                // delete old image if it exists
                yield cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
            }
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        yield user.save();
        yield redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get all users --only fot admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// update user role --only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = req.body;
        (0, user_service_1.updateUserRoleService)(res, email, role);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// delete user -admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        yield user.deleteOne({ id });
        yield redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
