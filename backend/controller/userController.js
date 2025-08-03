const asyncWrapper = require("../middleWare/asyncWrapper");
const UserModel = require("../model/UserModel");
const sendJwtToekn = require("../appUtills/jwtToken");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../appUtills/error");

// @desc    Search users (excluding current user)
// @route   GET /api/user?search=
// @access  Private
exports.allSearchUser = asyncWrapper(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  res.status(200).json(users);
});

// @desc    Register new user
// @route   POST /api/user
// @access  Public
exports.registerUser = asyncWrapper(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  let picUrl = pic;
  if (pic) {
    const myCloud = await cloudinary.v2.uploader.upload(pic, {
      folder: "profile",
      width: 150,
      crop: "scale",
    });
    picUrl = myCloud.secure_url;
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    pic: picUrl,
  });

  if (!user) {
    return next(new ErrorHandler("User creation failed", 500));
  }

  sendJwtToekn(user, 201, res);
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
exports.loginController = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendJwtToekn(user, 200, res);
});

// @desc    Logout user
// @route   GET /api/user/logout
// @access  Private
exports.logoutUser = asyncWrapper(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Load current user
// @route   GET /api/user/me
// @access  Private
exports.loadUser = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json(user);
});
