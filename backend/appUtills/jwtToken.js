const sendJwtToekn = (userData, statusCode, res) => {
  const token = userData.getJwtToken(); // Get token from model method

  console.log("User Token Payload:", JSON.stringify(userData, null, 2));

  // Options for setting the cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // Example: COOKIE_EXPIRE = 2
    httpOnly: true, // Cookie not accessible from JS (for security)
  };

  // Send response with token in cookie and body
  res.status(statusCode).cookie("token", token, options).json({
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    isAdmin: userData.isAdmin,
    pic: userData.pic,
    createdAt: userData.createdAt,
    token, // ✅ This makes the token available in frontend
  });
};

module.exports = sendJwtToekn;
