import express from "express"
import {Server} from "socket.io"
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors: {
        origin: "https://uilconnectapp.onrender.com", 
       credentials: true,
    }
});


export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// use to store Online  users 
const userSocketMap = {};



io.on("connection", (socket)=> {
    console.log("A User Connected", socket.id);
    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId]= socket.id;
    };

    // send events to all Connected Clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("A user Disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


export {io, app , server}