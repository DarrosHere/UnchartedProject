const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
     
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired" }); 
      }
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

   
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    req.user = { email: user.email, id: user._id };

    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
