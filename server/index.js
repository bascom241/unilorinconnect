import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import marketRouter from './routes/useMarket.js';
import eventRouter from "./routes/userEventRouter.js"
import useMessageRouter from "./routes/useMessageRouter.js"
import { connectDB } from './utils/connectDb.js';
import cookieParser from 'cookie-parser';
import { io, server ,app } from './lib/socket.js';
import useResourcesRouter from './routes/useResources.js';
import lostAndFoundRouter from './routes/useLostAndFound.js';
dotenv.config();
app.use(cors(
    {
        origin: "http://localhost:8080",
        credentials: true, // Allow credentials (cookies) to be sent
    }
));

app.use(express.json());
app.use(cookieParser())



app.use('/api/users', userRouter);
app.use("/api", marketRouter);
app.use("/api",eventRouter);
app.use("/api", useMessageRouter);
app.use("/api", useResourcesRouter);
app.use("/api", lostAndFoundRouter);
connectDB();

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})
