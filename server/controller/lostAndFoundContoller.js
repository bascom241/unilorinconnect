import LostAndFound from "../model/LostAndFound.js";
import cloudinary from "../utils/cloudinary.js";

export const createLostAndFound = async (req, res) => {
    try {
        const { title, description, location, contactInfo, lostItem, foundItem } = req.body;

        
        // Handle image upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);



        const lostAndFoundItem = new LostAndFound({
            posterInformation: req.user.userId,
            title,
            description,
            imageUrl: result.secure_url,
            location,
            contactInfo,
            lostItem,
            foundItem
        });

        await lostAndFoundItem.save();

        res.status(201).json({
            success: true,
            message: "Lost and Found item created successfully",
            data: lostAndFoundItem
        });
    } catch (error) {
        console.error("Error creating Lost and Found item:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getLostAndFoundItems = async (req, res) => {
    try {
        const items = await LostAndFound.find().populate('posterInformation', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error("Error fetching Lost and Found items:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
export const getMyLostAndFoundItems = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming req.user is populated by verifyToken middleware
        const items = await LostAndFound.find({ posterInformation: userId })
            .populate('posterInformation', 'fullName email');

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error("Error fetching user's Lost and Found items:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};