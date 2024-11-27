const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({message: 'Access denied'});
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

exports.authorizeRoles = (allowedRoles) => (req, res, next) => {
  try {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: Unauthorized role" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

//   if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid token" });
//   }
// };

// const checkRole = (allowedRoles) => (req, res, next) => {
//   if (!allowedRoles.includes(req.user.role)) {
//     return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
//   }
//   next();
// };

// module.exports = { verifyToken, checkRole };
