const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return respond(res, false, 401, 'No token provided', {});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();

  } catch (error) {
    return respond(res, false, 401, 'Invalid token', {});
  }
};