import Message from "../model/messageModel.js";
import cloudinary from "../utils/cloudinary.js";
import User from "../model/userModel.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
const getAllUsers = async (req, res) => {
    try {
        const loggedInUser = req.user.userId;

        const filterUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

        if (!filterUsers || filterUsers.length === 0) {
            return res.status(404).json({ message: "No other users found" });
        }

        res.status(200).json({ filterUsers });
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({ message: error.message });
    }
};
const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user.userId;

        const messages = await Message.find({
            $or:[
                {senderId:myId,recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        })
       

        res.status(200).json({messages});
    } catch (error) {
        res.status(500).json({message: "Internal Error Found"})
    }
}

const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user.userId;

 if (!recieverId) {
    console.log("RecieverId not found")
    return res.status(401).json("RecieverId not found")
}

        if(!senderId){
             console.log("Sender Id not found")
            return res.status(401).json("Sender Id not found")
        }
        if(!text){
            console.log("Text not found")
            return res.status(401).json("Text not found")
        }
        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        // todo Real Time Functionalities

        const receiverSocketId = getReceiverSocketId(recieverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error})
    }
}

export {getAllUsers, getMessages, sendMessage}