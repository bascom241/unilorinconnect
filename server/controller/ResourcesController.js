import Resources from "../model/resourcesModel.js";
import cloudinary from "../utils/cloudinary.js";

const saveResources = async (req, res) => {
    const { Title, Description, category, courseCode, YearLevel } = req.body;
    if (!Title || !Description || !category || !courseCode || !YearLevel || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const resourceOwner = req.user.userId; // Assuming req.user is populated by verifyToken middleware

    let result;
    try {
        result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto'
        });
    } catch (err) {
        return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    const fileUrl = result.secure_url;
    const fileType = result.resource_type;
    const fileName = req.file.originalname;
    try {
        const newResource = new Resources({
            Title,
            Description,
            fileUrl,
            fileType,
            fileName,
            category,
            courseCode,
            YearLevel,
            resourceOwner
        });

        await newResource.save();
        res.status(201).json({ success: true, message: "Resource saved successfully", resource: newResource });
    } catch (error) {
        console.error("Error saving resource:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const fetchResources = async (req, res) => {
    try {
        const resources = await Resources.find().populate('resourceOwner', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const fetchMyResources = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming req.user is populated by verifyToken middleware
        const resources = await Resources.find({ resourceOwner: userId }).populate('resourceOwner', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, resources });
    } catch (error) {
        console.error("Error fetching user's resources:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { saveResources, fetchResources, fetchMyResources }