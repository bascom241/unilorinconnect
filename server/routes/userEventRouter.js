import express from 'express';
import { addEvent,fetchEvents,addAttendieToEvent,fetchSingleEvent, fetchTopThreeEvents} from '../controller/EventController.js';
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();


router.post("/event", verifyToken, addEvent);
router.get("/events", verifyToken, fetchEvents);
router.post("/event/:id", verifyToken, addAttendieToEvent);
router.get("/event/:eventId", verifyToken,fetchSingleEvent);
router.get("/event", verifyToken, fetchTopThreeEvents)

export default router;