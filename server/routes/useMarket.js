import express from "express";
import { upload } from "../middlewares/upload.js";
import { registerMarketItem, fetchMarketItems, fetchTopThreeMarketItems } from "../controller/MarketItemController.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/item",verifyToken, upload.single("itemImage"), registerMarketItem );
router.get("/items", verifyToken, fetchMarketItems);
router.get("/items/top-three", verifyToken, fetchTopThreeMarketItems);

export default router;
