import env from "dotenv";
import { google } from "googleapis";
env.config();
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "node:path";
import ejs from "ejs";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

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
export const CreateAccountPasswordEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_MAIL as string,
      type: "OAuth2",
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const token = jwt.sign(
    {
      id: user?._id,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES, 10) }
  );

  const URL_value = `https://gitsimulator-fe.web.app/auth/login/${token}`;
  // const URL_value =
  //   process.env.PORT === "development"
  //     ? `http://localhost:5173/auth/login/${token}`
  //     : "https://gitsimulator-fe.web.app";

  const pathFile = path.join(__dirname, "../views/createaccount.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
    // otp: user?.otp,
    // time: user?.otpExpiresAT,
    url: URL_value,
  });
  const mailer = {
    to: user?.email,
    from: `<${process.env.GOOGLE_MAIL as string}>`,
    subject: "Account creation",
    text: "just text message",
    html,
  };

  await Transporter.sendMail(mailer).then(() => {
    console.clear();
    console.log("Email Sent📧");
  });
};

export const ForgetAccountPasswordEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;

  const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_MAIL as string,
      type: "OAuth2",
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const token = jwt.sign(
    {
      id: user?._id,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXIRES as string, 10) }
  );

  // const URL_value =
  //   process.env.PORT === "development"
  //     ? `http://localhost:5173/auth/change-ps/${token}`
  //     : "https://gitsimulator-fe.web.app";
  // const URL_value = "https://gitsimulator-fe.web.app";
  const URL_value = `https://gitsimulator-fe.web.app/auth/change-ps/${token}`;

  const pathFile = path.join(__dirname, "../views/forgetaccount.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
    // otp: user?.otp,
    // time: user?.otpExpiresAT,
    url: URL_value,
  });
  const mailer = {
    to: user?.email,
    from: `<${process.env.GOOGLE_MAIL as string}>`,
    subject: "Reset Password ",
    text: "just text message",
    html,
  };

  await Transporter.sendMail(mailer).then(() => {
    console.clear();
    console.log("Email Sent📧");
  });
};
