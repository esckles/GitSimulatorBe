import { Router } from "express";
import {
  ChangeUserAccountPassword,
  ForgetUserAccountPassword,
  LoginUserAccount,
  ReadAllUserAccount,
  ReadOneUserAccount,
  RegisterUserAccount,
  VerifyUSerAccount,
} from "../controller/userController";

const router: any = Router();

router.route("/register-account").post(RegisterUserAccount);
router.route("/verify-account/:userID").post(VerifyUSerAccount);
router.route("/login-account").post(LoginUserAccount);
router.route("/readone-account").get(ReadOneUserAccount);
router.route("/readall-account").get(ReadAllUserAccount);
router.route("/forget-account-password").patch(ForgetUserAccountPassword);
router
  .route("/change-account-password/:userID")
  .patch(ChangeUserAccountPassword);

export default router;
