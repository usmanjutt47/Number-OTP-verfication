const jwt = require("jsonwebtoken"); // Assuming you're using JWT for authentication

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id; // Attach userId to request object
    next();
  });
};

module.exports = authMiddleware;
