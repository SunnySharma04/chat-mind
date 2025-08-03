const express = require("express");
const {
  registerUser,
  loginController,
  allSearchUser,
  logoutUser,
  loadUser,
} = require("../controller/userController");
const { authentication } = require("../middleWare/auth");

const router = express.Router();

// Register new user
router.post("/", registerUser);

// Login
router.post("/login", loginController);

// Search users (requires login)
router.get("/", authentication, allSearchUser);

// Optional: Logout route (enable if needed)
router.get("/logout", logoutUser);

// Optional: Load current user data (enable if needed)
router.get("/me", authentication, loadUser);

module.exports = router;
