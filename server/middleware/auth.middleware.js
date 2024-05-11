const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({ msg: "You are not authorized" });
        } else {
            const decoded = await jwt.verify(token, "password");
            req.userID = decoded.userID;
            next();
        }
    } catch (err) {
        console.error("Error during JWT verification:", err);
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = {
    auth
};
