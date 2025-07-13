import express from 'express';
import { upload } from '../middlewares/upload.js';
import { createLostAndFound, getLostAndFoundItems, getMyLostAndFoundItems } from '../controller/lostAndFoundContoller.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();
router.post('/item-lost', verifyToken, upload.single('image'), createLostAndFound);
router.get('/items-lost', verifyToken, getLostAndFoundItems);
router.get('/my-items-lost', verifyToken, getMyLostAndFoundItems);
export default router;