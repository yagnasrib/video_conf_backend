const rooms = {}; // Store active rooms and participants

const createRoom = (req, res) => {
    const { roomId } = req.body;
    if (!rooms[roomId]) {
        rooms[roomId] = [];
        res.status(201).json({ message: "Room created", roomId });
    } else {
        res.status(400).json({ error: "Room already exists" });
    }
};

const joinRoom = (req, res) => {
    const { roomId, userId } = req.body;
    if (!rooms[roomId]) {
        return res.status(404).json({ error: "Room not found" });
    }
    rooms[roomId].push(userId);
    res.json({ message: `User ${userId} joined room ${roomId}` });
};

const getRoomInfo = (req, res) => {
    const { roomId } = req.params;
    if (rooms[roomId]) {
        res.json({ roomId, participants: rooms[roomId] });
    } else {
        res.status(404).json({ error: "Room not found" });
    }
};

module.exports = { createRoom, joinRoom, getRoomInfo };
