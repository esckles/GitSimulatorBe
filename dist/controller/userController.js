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
exports.ChangeUserAccountPassword = exports.ForgetUserAccountPassword = exports.ReadAllUserAccount = exports.ReadOneUserAccount = exports.LoginUserAccount = exports.VerifyUserAccount = exports.RegisterUserAccount = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
const RegisterUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const { otp } = (0, otp_1.generateOtp)();
        const salt = yield bcrypt_1.default.genSalt(9);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            name,
            email,
            password: hashed,
            isVerifiedToken: token,
            otp: otp,
        });
        (0, email_1.CreateAccountPasswordEmail)(user);
        return res.status(201).json({
            message: "Account created successfully",
            status: 201,
            data: user,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.RegisterUserAccount = RegisterUserAccount;
// export const RegisterUserAccount = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { name, email, password } = req.body;
//     const salt = await bcrypt.genSalt(9);
//     const hashed = await bcrypt.hash(password, salt);
//     const token = crypto.randomBytes(4).toString("hex");
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashed,
//       isVerifiedToken: token,
//     });
//     CreateAccountPasswordEmail(user);
//     return res.status(201).json({
//       message: "Account created successfully",
//       status: 201,
//       data: user,
//     });
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ message: "Error creating account", status: 404 });
//   }
// };
const VerifyUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { otp } = req.body;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.otp) === otp) {
                const otpExpiresAt = new Date(user === null || user === void 0 ? void 0 : user.otpExpiresAT);
                const currentDate = new Date();
                if (currentDate > otpExpiresAt) {
                    return res.status(404).json({ message: "OTP EXPIRED", status: 404 });
                }
                else {
                    const updatedUser = yield userModel_1.default.findByIdAndUpdate(userID, {
                        isVerified: true,
                        isVerifiedToken: "",
                        otp: "",
                        otpExpiresAT: "",
                    }, { new: true });
                    return res.status(201).json({
                        message: "Account Verified successfully",
                        status: 201,
                        data: updatedUser,
                    });
                }
            }
            else {
                return res.status(404).json({ message: "Invalid OTP", status: 404 });
            }
        }
        else {
            return res
                .status(404)
                .json({ message: "No account found with such email", status: 404 });
        }
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.VerifyUserAccount = VerifyUserAccount;
// export const VerifyUSerAccount = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const user = await userModel.findByIdAndUpdate(
//       userID,
//       {
//         isVerified: true,
//         isVerifiedToken: "",
//       },
//       { new: true }
//     );
//     return res.status(201).json({
//       message: "Account verified successfully",
//       status: 201,
//       data: user,
//     });
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ message: "Error verifiying account", status: 404 });
//   }
// };
const LoginUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const descrptPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (descrptPassword) {
                if ((user === null || user === void 0 ? void 0 : user.isVerified) && (user === null || user === void 0 ? void 0 : user.isVerifiedToken) === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES, 10) });
                    return res
                        .status(201)
                        .json({ message: "Welcome back", status: 201, data: token });
                }
                else {
                    return res
                        .status(404)
                        .json({ message: "Error verifying account", status: 404 });
                }
            }
            else {
                return res
                    .status(404)
                    .json({ message: "Incorrect Password", status: 404 });
            }
        }
        else {
            return res.status(404).json({
                message: "No account found with this email go and register",
                status: 404,
            });
        }
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.LoginUserAccount = LoginUserAccount;
const ReadOneUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById({
            userID,
        });
        return res.status(201).json({
            message: "One user Account read successfully",
            status: 201,
            data: user,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.ReadOneUserAccount = ReadOneUserAccount;
const ReadAllUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(201).json({
            message: "All user Account read successfully",
            status: 201,
            data: user,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.ReadAllUserAccount = ReadAllUserAccount;
const ForgetUserAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        const token = crypto_1.default.randomBytes(6).toString("hex");
        if (user) {
            yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                isVerifiedToken: token,
            }, { new: true });
            (0, email_1.ForgetAccountPasswordEmail)(user);
            return res.status(200).json({
                message: "an email has been sent to your for password reset",
                status: 200,
                data: user,
            });
        }
        else {
            return res
                .status(404)
                .json({ message: "Error With Forget account Ppassword", status: 404 });
        }
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.ForgetUserAccountPassword = ForgetUserAccountPassword;
const ChangeUserAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        if (userID) {
            yield userModel_1.default.findByIdAndUpdate(userID, {
                password: hashed,
                isVerifiedToken: "",
            }, { new: true });
            return res.status(200).json({
                message: "Password change SUccessfully",
                status: 200,
            });
        }
        else {
            return res
                .status(404)
                .json({ message: "Error With Forget account Ppassword", status: 404 });
        }
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error creating account", status: 404 });
    }
});
exports.ChangeUserAccountPassword = ChangeUserAccountPassword;
