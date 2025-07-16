import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.log("No token found in cookies");
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Verification Error:", err.message);
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded;
        next();
    });
};

export default verifyToken;
