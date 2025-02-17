const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);


const app = express();
const server = http.createServer(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// CORS configuration
const corsOptions = {
  origin: "https://frontendvideo-call-d6oi.vercel.app", // Update this with your frontend URL if different
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

const rooms = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("create-room", (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    console.log(`Room created: ${roomId}`);
  });

  socket.on("join-room", ({ roomId, userId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(userId);
    socket.join(roomId);

    console.log(`User ${userId} joined room ${roomId}`);
    io.to(roomId).emit("room-update", rooms[roomId]);

    if (rooms[roomId].length < 2) {
      io.to(roomId).emit("waiting", "Waiting for more participants...");
    } else {
      io.to(roomId).emit("start-call", "All participants joined, starting call...");
    }
  });

  socket.on("leave-room", ({ roomId, userId }) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
      socket.leave(roomId);
      io.to(roomId).emit("room-update", rooms[roomId]);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
