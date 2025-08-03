const asyncWrapper = require("../middleWare/asyncWrapper");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../appUtills/error");
const userModel = require("../model/UserModel");

exports.authentication = asyncWrapper(async (req, res, next) => {
  let token;

  // 1. Check Authorization header: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If not in header, try cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decoded.id).select("-password"); // optional: exclude password
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid token, login again", 401));
  }
});
