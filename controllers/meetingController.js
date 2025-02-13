const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const rooms = {}; // Temporary in-memory storage for hosts

exports.generateToken = async (req, res) => {
  console.log("Received request:", req.body);

  const { roomID, userID, userName } = req.body;

  if (!roomID || !userID || !userName) {
    return res.status(400).json({ error: "Missing roomID, userID, or userName." });
  }

  try {
    const appID = Number(process.env.REACT_APP_APP_ID);
    const serverSecret = process.env.REACT_APP_SERVER_SECRET;

    if (!appID || !serverSecret) {
      return res.status(500).json({ error: "Missing APP_ID or SERVER_SECRET in .env." });
    }

    const payload = {
      app_id: appID,
      user_id: userID,
      room_id: roomID,
      privilege: { "1": 1, "2": 1 },
      exp: Math.floor(Date.now() / 1000) + 7200,
    };

    console.log("Generated Kit Token Payload:", payload);

    const kitToken = jwt.sign(payload, serverSecret, { algorithm: "HS256" });

    console.log("Generated Kit Token:", kitToken);

    const newToken = new Token({ roomID, userID, userName, kitToken });

    await newToken.save();

    return res.json({ kitToken });
  } catch (error) {
    console.error("Token generation failed:", error);
    return res.status(500).json({ error: "Failed to generate token." });
  }
};

// ✅ Get the host of a room
exports.getHost = (req, res) => {
  const roomID = req.params.roomID;
  res.json({ hostID: rooms[roomID]?.hostID || null });
};

// ✅ Set the host for a room
exports.setHost = (req, res) => {
  const roomID = req.params.roomID;
  const { hostID } = req.body;

  if (!rooms[roomID]) {
    rooms[roomID] = { hostID };
    console.log(`Host set for room ${roomID}: ${hostID}`);
  }

  res.json({ success: true, hostID: rooms[roomID].hostID });
};
