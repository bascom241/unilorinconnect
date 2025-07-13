import { MarketItem } from "../model/marketItemModel.js";
import cloudinary from "../utils/cloudinary.js";

const registerMarketItem = async (req, res) => {
    try {
        const { Title, Description, price, category, condition } = req.body;
        console.log(req.body, req.file);
        const posterInformation = req.user.userId;
        // console.log(posterInformation)
        if (!posterInformation || !Title || !Description || !price || !category || !condition || !req.file) {
            return res.status(404).json({ message: "All Fields are required" })
        }

        const result = await cloudinary.uploader.upload(req.file.path)

        const newItem = new MarketItem({
            posterInformation,
            Title,
            Description,
            price,
            category,
            condition,
            itemImage: result.secure_url
        });

        await newItem.save();
        res.status(201).json({ success: true, newItem, message: "NewItem Uploaded" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });

    }
}

const fetchMarketItems = async (req, res) => {
    try {
        const { sort, category, search, condition, page = 1, limit = 10 } = req.query;
        console.log(req.query )
        const query = {

        };
        if (search) {
            query.$or = [
                { Title: { $reqex: search, $options: "i" } },
                { Description: { $regex: search, $options: "i" } }
            ]
        }

        if (category) {
            query.category = category;
        }
        if (condition) {
            query.condition = condition;
        }

        let sortOption = { createdAt: -1 }; // Default sort by createdAt descending

        if (sort === "price-asc") sortOption = { price: 1 };
        if (sort === "price-desc") sortOption = { price: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };

        // Pagination Logic 

        const skip = (Number(page) - 1) * Number(limit);
        const totalItems = await MarketItem.countDocuments(query);
        const items = await MarketItem.find(query).sort(sortOption).skip(skip).limit(Number(limit)).populate("posterInformation", "fullName email");


        res.status(200).json({
            success: true,
            items,
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
        })
    } catch(error) {
        console.error("Error fetching market items:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const fetchTopThreeMarketItems = async (req,res) => {
    try {
        const marketItems = await MarketItem.find().sort({createdAt:-1}).limit(3).populate("posterInformation", "fullName email");
        res.status(200).json({ success: true, marketItems });
    } catch (error) {
        console.error("Error fetching top three market items:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
} 



export { registerMarketItem, fetchMarketItems, fetchTopThreeMarketItems };