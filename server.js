const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);

const rooms = {}; // Store room participants

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

        // Notify when waiting for others
        if (rooms[roomId].length < 2) {
            io.to(roomId).emit("waiting", "Waiting for more participants...");
        } else {
            io.to(roomId).emit("start-call", "All participants joined, starting call...");
        }
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(id => id !== userId);
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
