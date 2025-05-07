"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.route("/register-account").post(userController_1.RegisterUserAccount);
router.route("/verify-account/:userID").post(userController_1.VerifyUserAccount);
router.route("/login-account").post(userController_1.LoginUserAccount);
router.route("/readone-account").get(userController_1.ReadOneUserAccount);
router.route("/readall-account").get(userController_1.ReadAllUserAccount);
router.route("/forget-account-password").patch(userController_1.ForgetUserAccountPassword);
router
    .route("/change-account-password/:userID")
    .patch(userController_1.ChangeUserAccountPassword);
exports.default = router;
