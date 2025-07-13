import express from 'express';
const router = express.Router();
import { saveResources,fetchResources,  fetchMyResources } from '../controller/ResourcesController.js';
import { upload } from '../middlewares/upload.js';
import verifyToken from '../middlewares/verifyToken.js';

router.post('/resources', verifyToken, upload.single('file'), saveResources);
router.get('/resources', verifyToken, fetchResources);
router.get('/resources/my', verifyToken, fetchMyResources);


export default router;