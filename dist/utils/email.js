"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetAccountPasswordEmail = exports.CreateAccountPasswordEmail =
  void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_path_1 = __importDefault(require("node:path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;
const oAuth = new googleapis_1.google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_URL
);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });
// export const CreateAccountPasswordEmail = async (user: any) => {
//   const accessToken: any = (await oAuth.getAccessToken()).token;
//   const Transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GOOGLE_MAIL as string,
//       type: "OAuth2",
//       clientId: GOOGLE_ID,
//       clientSecret: GOOGLE_SECRET,
//       refreshToken: GOOGLE_TOKEN,
//       accessToken: accessToken,
//     },
//   });
//   const id = user?._id;
//   const URL_value = `http://localhost:5173/auth/otp/${id}`;
//   const pathFile = path.join(__dirname, "../views/createaccount.ejs");
//   const html = await ejs.renderFile(pathFile, {
//     name: user?.name,
//     otp: user?.otp,
//     time: user?.otpExpiresAT,
//     url: URL_value,
//   });
//   const mailer = {
//     to: user?.email,
//     from: `<${process.env.GOOGLE_MAIL as string}>`,
//     subject: "Account creation",
//     text: "just text message",
//     html,
//   };
//   await Transporter.sendMail(mailer).then(() => {
//     console.clear();
//     console.log("Email Send📧");
//   });
// };
const CreateAccountPasswordEmail = (user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (yield oAuth.getAccessToken()).token;
    const Transporter = nodemailer_1.default.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        type: "OAuth2",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_TOKEN,
        accessToken: accessToken,
      },
    });
    // const token = jwt.sign(
    //   {
    //     id: user?._id,
    //   },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: (process.env.JWT_EXPIRES, 10) }
    // );
    // const URL_value = `https://gitsimulator-fe.web.app/auth/login/${token}`;
    // const id = user === null || user === void 0 ? void 0 : user._id;
    // const URL_value = `https://gitsimulator-fe.web.app/auth/otp/${id}`;
    const id = user?._id;
    const URL_value = `https://gitsimulator-fe.web.app/auth/otp/${id}`;
    // const FRONTEND_URL =
    //   process.env.NODE_ENV === "development"
    //     ? process.env.FRONTEND_DEV_URL
    //     : process.env.FRONTEND_PROD_URL;

    // console.log("ENV:", process.env.NODE_ENV);
    // const URL_value = `${FRONTEND_URL}/auth/otp/${id}`;
    // const URL_value = `https://gitsimulator-fe.web.app/auth/login/${token}`;
    // const FRONTEND_URL =
    //   process.env.NODE_ENV === "development"
    //     ? process.env.FRONTEND_DEV_URL
    //     : process.env.FRONTEND_PROD_URL;
    // console.log("ENV:", process.env.NODE_ENV);
    // const URL_value = `${FRONTEND_URL}/auth/login/${token}`;
    const pathFile = node_path_1.default.join(
      __dirname,
      "../views/createaccount.ejs"
    );
    const html = yield ejs_1.default.renderFile(pathFile, {
      name: user === null || user === void 0 ? void 0 : user.name,
      otp: user === null || user === void 0 ? void 0 : user.otp,
      time: user === null || user === void 0 ? void 0 : user.otpExpiresAT,
      url: URL_value,
    });
    const mailer = {
      to: user === null || user === void 0 ? void 0 : user.email,
      from: `<${process.env.GOOGLE_MAIL}>`,
      subject: "Account creation",
      text: "just text message",
      html,
    };
    yield Transporter.sendMail(mailer).then(() => {
      console.clear();
      console.log("Email Sent📧");
    });
  });
exports.CreateAccountPasswordEmail = CreateAccountPasswordEmail;
const ForgetAccountPasswordEmail = (user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (yield oAuth.getAccessToken()).token;
    const Transporter = nodemailer_1.default.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        type: "OAuth2",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_TOKEN,
        accessToken: accessToken,
      },
    });
    const id = user?._id;
    const URL_value = `https://gitsimulator-fe.web.app/auth/change-ps/${id}`;
    // const FRONTEND_URL =
    //   process.env.NODE_ENV === "development"
    //     ? process.env.FRONTEND_DEV_URL
    //     : process.env.FRONTEND_PROD_URL;

    // console.log("ENV:", process.env.NODE_ENV);
    // const URL_value = `${FRONTEND_URL}/auth/change-ps/${id}`;
    // const token = jsonwebtoken_1.default.sign(
    //   {
    //     id: user === null || user === void 0 ? void 0 : user._id,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: (process.env.JWT_EXIRES, 10) }
    // );
    // const FRONTEND_URL =
    //   process.env.NODE_ENV === "development"
    //     ? process.env.FRONTEND_DEV_URL
    //     : process.env.FRONTEND_PROD_URL;
    // const URL_value = `${FRONTEND_URL}/auth/change-ps/${token}`;
    // const URL_value =
    //   process.env.NODE_ENV === "development"
    //     ? `http://localhost:5173/auth/change-ps/${token}`
    //     : `https://gitsimulator-fe.web.app/auth/change-ps/${token}`;
    // const URL_value = "https://gitsimulator-fe.web.app";
    // const URL_value = `https://gitsimulator-fe.web.app/auth/change-ps/${token}`;
    const pathFile = node_path_1.default.join(
      __dirname,
      "../views/forgetaccount.ejs"
    );
    const html = yield ejs_1.default.renderFile(pathFile, {
      name: user === null || user === void 0 ? void 0 : user.name,
      otp: user?.otp,
      time: user?.otpExpiresAT,
      url: URL_value,
    });
    const mailer = {
      to: user === null || user === void 0 ? void 0 : user.email,
      from: `"gitsimulator@gmail.com"<${process.env.GOOGLE_MAIL}>`,
      subject: "Reset Password ",
      text: "just text message",
      html,
    };
    yield Transporter.sendMail(mailer).then(() => {
      console.clear();
      console.log("Email Sent📧");
    });
  });
exports.ForgetAccountPasswordEmail = ForgetAccountPasswordEmail;
