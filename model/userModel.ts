import { Document, model, Schema } from "mongoose";

interface iUser {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isVerifiedToken: string;
  otp: string;
  otpExpiresAT: string;
}

interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isVerifiedToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiresAT: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<iUserData>("Users", userModel);
