import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendEmail, sendResetSuccessfullEmail, sendPasswordResetEmail } from "../mails/email.js";

import { MarketItem } from "../model/marketItemModel.js";
import Event from "../model/eventModel.js";
import Resources from "../model/resourcesModel.js";
const register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, matricNumber } = req.body;

        const requiredFields = ["fullName", "email", "password", "confirmPassword", "matricNumber"];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Please provide ${missingFields.join(", ")}` });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingMatricNumber = await User.findOne({ matricNumber });
        if (existingMatricNumber) {
            return res.status(400).json({ message: "Matric number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresDate = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = new User({
            fullName,
            email,
            password: hashedPassword, // Use hashed password here
            matricNumber,
            verificationToken,
            verificationTokenExpiresDate
        });

        const success =  await sendEmail(email, verificationToken,fullName);
        if (!success) {
            return res.status(500).json({ message: "Failed to send verification email, Try Again" });
        }
        await user.save();

        return res.status(201).json({ message: "Registration successful! Check your email to confirm your account.", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password);

        const missingFields = ["email", "password"].filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Please provide ${missingFields.join(", ")}` });
        }

        const user = await User.findOne({ email }).select("+password");
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(404).json({ message: "email or password Invalid" })
        }
        generateTokenAndSetCookie(user, res);

        // Remove sensitive fields before sending user data
        const { password: _, ...safeUser } = user.toObject();

        res.status(200).json({ message: "User logged in successfully", user: safeUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: "Verification code is required" });
        }

        // Log the incoming code for debugging
        console.log("Received verification code:", code);

        // Trim and normalize the code to handle whitespace or formatting issues
        // const normalizedCode = code.trim();

        // Query for user with the verification token and unexpired token
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresDate: { $gt: Date.now() }
        });

        // Log the query result and database state for debugging
        console.log("Queried user:", user);
        if (!user) {
            // Additional query to check if token exists but is expired or invalid
            const tokenExists = await User.findOne({ verificationToken:code });
            const expiredToken = await User.findOne({
                verificationToken: code,
                verificationTokenExpiresDate: { $lte: Date.now() }
            });
            console.log("Token exists check:", tokenExists);
            console.log("Expired token check:", expiredToken);

            if (expiredToken) {
                return res.status(400).json({ success:  false, message: "Verification code has expired" });
            }
            if (tokenExists) {
                return res.status(400).json({ success: false, message: "Invalid verification code" });
            }
            return res.status(404).json({ success: false, message: "No user found with this verification code" });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresDate = undefined;
  
        await user.save();

        // Log successful verification
        console.log("User verified:", user.email);

        return res.status(200).json({ success: true, message: "User verified successfully" });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const forgetPassord = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresDate = Date.now() + 3600000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresDate = resetPasswordExpiresDate;
        await user.save();
        await sendPasswordResetEmail(email, user.fullName, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
        res.status(200).json({ success: true, message: `Reset Password sent to ${email}` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {

    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresDate: { $gt: Date.now() } });
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Error hashing password" });
        }
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresDate = undefined;

        await user.save();
        await sendResetSuccessfullEmail(user.email);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        const userEvents = await Event.find({ eventOwner: req.user.userId })
        const userMarketItems = await MarketItem.find({ posterInformation: req.user.userId })
        const userResources = await Resources.find({ resourceOwner: req.user.userId })
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, user, events: userEvents, marketItems: userMarketItems, resources: userResources });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { register, login, forgetPassord, resetPassword, verifyEmail, logout, checkAuth, userProfile };


