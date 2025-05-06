const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

/**
 * Middleware funkcija autentifikavimui (tikrina JWT tokeną ir prideda vartotojo objektą prie `req`)
 */
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Jei nėra tokeno – grąžinamas 401 klaidos atsakymas
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Gaunamas vartotojas pagal tokeno ID
    const user = await User.findById(decoded.id).select("-password") 

    // Jei vartotojas nerastas – klaida
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user 

    next()
  } catch (error) {
    // Tokenas netinkamas ar pasibaigęs
    res.status(400).json({ message: "Invalid token", error })
  }
}

module.exports = authMiddleware
