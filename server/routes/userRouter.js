import express from 'express';
import { register, login, forgetPassord, resetPassword,verifyEmail,logout,checkAuth, userProfile } from '../controller/AuthController.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/verify-email",verifyEmail);
router.post("/forget-password",forgetPassord);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",logout);
router.get("/check-auth",verifyToken,checkAuth);
router.get("/profile",verifyToken,userProfile);
export default router;