const HttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) {
      throw new HttpError("Authentication failed, token missing.", 401);
    }
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed, token invalid.", 401));
  }
};
