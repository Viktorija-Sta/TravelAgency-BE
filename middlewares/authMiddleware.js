const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user 
    next()
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error })
  }
}

module.exports = authMiddleware
