# ChatMind - A Real-Time Chat Webapp

ChatMind is a full stack chat application that allows users to communicate with each other in real-time. It supports features like user authentication, one-on-one chat, group chat, user profile management, and more.

> ⭐ If you find this project helpful, please consider giving it a star and follow me on [GitHub](https://github.com/SunnySharma04) for more exciting projects like this!

---

## 🧱 Tech Stack

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square)](https://en.wikipedia.org/wiki/MERN_(software_bundle))
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000?style=flat-square)](https://expressjs.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Web%20Sockets-Socket.IO-010101?style=flat-square)](https://socket.io/)
[![Chakra UI](https://img.shields.io/badge/UI%20Framework-Chakra%20UI-319795?style=flat-square)](https://chakra-ui.com/)

---


---

## 📂 Table of Contents

- [Intro](#intro)
- [Sections](#sections)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Environment Variables](#setting-up-env-in-backend)
- [Packages Used](#packages-used)
- [Upcoming Features](#upcoming-features)
- [Contribution Guidelines](#contribution-guidelines)
- [Author & Maintainer](#author--maintainer)

---

## 📝 Intro

ChatMind is a chat application built with the MERN stack. It provides a seamless and real-time chatting experience for users. With features like user authentication, one-on-one chat, group chat, and user profile management, ChatMind offers a complete modern messaging solution.

---

## 📌 Sections

- **Home**
  - Login Page
  - Sign Up Page
  - Forgot Password
- **Chat Page**
  - Search Users
  - One-on-One Chat
  - Group Chat
  - User Profile
  - Group Menu

---

## ⬇️ Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/SunnySharma04/chat-mind.git
Install dependencies
Backend

bash
Copy
Edit
npm install
Frontend

bash
Copy
Edit
cd frontend
npm install
Run the backend

bash
Copy
Edit
npm start
Run the frontend

bash
Copy
Edit
cd frontend
npm start
🗂️ Folder Structure
markdown
Copy
Edit
- backend/
  - app.js
  - controller/
  - model/
  - route/
  - middleware/
  - db/
  - appUtils/
  - utils/
- frontend/
  - public/
  - src/
    - components/
    - config/
    - Context/
    - Pages/
    - animations/
    - img/
🔐 Setting Up .env in Backend
Create a .env file in backend/utils/ with the following:

env
Copy
Edit
PORT=5000
DB_LINK=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=2d
COOKIE_EXPIRE=2
NODE_ENV=production
CLOUDINARY_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_secret
CLOUDINARY_URL=your_cloudinary_url
📦 Packages Used
Backend:
express

mongoose

bcryptjs

jsonwebtoken

cors

dotenv

cloudinary

multer

cookie-parser

nodemailer

Frontend:
react

chakra-ui

socket.io-client

axios

react-router-dom

framer-motion

react-lottie

styled-components

🚀 Upcoming Features
AI-powered chat using OpenAI API

Dark mode toggle

Audio and video calls

Media sharing (images, files)

Password reset

Admin dashboard

📬 Contribution Guidelines
Fork the repository

Create a new branch

Make your changes

Submit a pull request

Raise issues for:

Feature requests

Bugs

Documentation improvements

👨‍💻 Author & Maintainer
Sunny Sharma
📧 sunnysharma112004@gmail.com
💻 GitHub - SunnySharma04

🤝 Contributors
Sunny Sharma

Happy chatting with ChatMind!
Made with ❤️ by Sunny Sharma
