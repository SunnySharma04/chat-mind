const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const connectDB = require("../backend/db/connectDB");
const errorMiddleware = require("./middleWare/errorHandler");

// Routes
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoutes");

dotenv.config();

// ============ MIDDLEWARE SETUP ============ //
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

// CORS - allow frontend to communicate with backend
app.use(
  cors({
    origin: [
      "https://chat-mind-phi.vercel.app", // Vercel production
      "http://localhost:3000", // local dev
    ],
    credentials: true,
  })
);

// ============ ROUTES ============ //
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

// ============ CLOUDINARY CONFIG ============ //
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ============ FRONTEND DEPLOYMENT HANDLER ============ //
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// ============ ERROR HANDLER (last middleware) ============ //
app.use(errorMiddleware);

// ============ DB CONNECTION + SERVER START ============ //
connectDB();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// ============ SOCKET.IO CONFIG ============ //
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "https://chat-mind-phi.vercel.app", // Vercel frontend
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");

    // Save user ID to socket for disconnection cleanup
    socket.userId = userData._id;
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log(`USER DISCONNECTED: ${socket.userId}`);
    socket.leave(socket.userId);
  });
});
