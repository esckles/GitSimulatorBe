import env from "dotenv";
env.config();
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import userModel from "../model/userModel";
// import { generateOtp } from "../utils/otp";
import {
  CreateAccountPasswordEmail,
  ForgetAccountPasswordEmail,
} from "../utils/email";

// export const RegisterUserAccount = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { name, email, password } = req.body;
//     const { otp } = generateOtp();
//     const salt = await bcrypt.genSalt(9);
//     const hashed = await bcrypt.hash(password, salt);
//     const token = crypto.randomBytes(4).toString("hex");
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashed,
//       isVerifiedToken: token,
//       otp: otp,
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
export const RegisterUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(9);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");
    const user = await userModel.create({
      name,
      email,
      password: hashed,
      isVerifiedToken: token,
    });
    CreateAccountPasswordEmail(user);
    return res.status(201).json({
      message: "Account created successfully",
      status: 201,
      data: user,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

// export const VerifyUserAccount = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { userID } = req.params;
//     const { otp } = req.body;

//     const user = await userModel.findById(userID);
//     if (user) {
//       if (user?.otp === otp) {
//         const otpExpiresAt = new Date(user?.otpExpiresAT);
//         const currentDate = new Date();
//         if (currentDate > otpExpiresAt) {
//           return res.status(404).json({ message: "OTP EXPIRED", status: 404 });
//         } else {
//           const updatedUser = await userModel.findByIdAndUpdate(
//             userID,
//             {
//               isVerified: true,
//               isVerifiedToken: "",
//               otp: "",
//               otpExpiresAT: "",
//             },
//             { new: true }
//           );
//           return res.status(201).json({
//             message: "Account Verified successfully",
//             status: 201,
//             data: updatedUser,
//           });
//         }
//       } else {
//         return res.status(404).json({ message: "Invalid OTP", status: 404 });
//       }
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No account found with such email", status: 404 });
//     }
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ message: "Error creating account", status: 404 });
//   }
// };

export const VerifyUSerAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        isVerifiedToken: "",
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Account verified successfully",
      status: 201,
      data: user,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error verifiying account", status: 404 });
  }
};

export const LoginUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      const descrptPassword = await bcrypt.compare(password, user?.password);
      if (descrptPassword) {
        if (user?.isVerified && user?.isVerifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            { expiresIn: parseInt(process.env.JWT_EXPIRES as string, 10) }
          );
          return res
            .status(201)
            .json({ message: "Welcome back", status: 201, data: token });
        } else {
          return res
            .status(404)
            .json({ message: "Error verifying account", status: 404 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Incorrect Password", status: 404 });
      }
    } else {
      return res.status(404).json({
        message: "No account found with this email go and register",
        status: 404,
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const ReadOneUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById({
      userID,
    });
    return res.status(201).json({
      message: "One user Account read successfully",
      status: 201,
      data: user,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const ReadAllUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();
    return res.status(201).json({
      message: "All user Account read successfully",
      status: 201,
      data: user,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};
export const ForgetUserAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    const token = crypto.randomBytes(6).toString("hex");
    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          isVerifiedToken: token,
        },
        { new: true }
      );
      ForgetAccountPasswordEmail(user);
      return res.status(200).json({
        message: "an email has been sent to your for password reset",
        status: 200,
        data: user,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Error With Forget account Ppassword", status: 404 });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const ChangeUserAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          password: hashed,
          isVerifiedToken: "",
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Password change SUccessfully",
        status: 200,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Error With Forget account Ppassword", status: 404 });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};
