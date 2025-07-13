import express from 'express';
import { getAllUsers, getMessages, sendMessage } from '../controller/MesageController.js';
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();



router.post("/message/:id",verifyToken, upload.single("image"), sendMessage);
router.get("/users", verifyToken, getAllUsers);
router.get("/messages/:id", verifyToken, getMessages);

export default router;