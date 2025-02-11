const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

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

    // Create the payload
    const payload = {
      app_id: appID,
      user_id: userID,
      room_id: roomID,
      privilege: { "1": 1, "2": 1 }, // Allow Publish & Subscribe
      exp: Math.floor(Date.now() / 1000) + 7200 // Token expires in 2 hours
    };

    // Log the payload for debugging
    console.log("Generated Kit Token Payload:", payload);

    // Generate the token using the payload and server secret
    const kitToken = jwt.sign(payload, serverSecret, { algorithm: "HS256" });

    // Log the generated token for debugging
    console.log("Generated Kit Token:", kitToken);

    // Save the token to the database
    const newToken = new Token({ roomID, userID, userName, kitToken });

    await newToken.save();

    return res.json({ kitToken });
  } catch (error) {
    console.error("Token generation failed:", error);
    return res.status(500).json({ error: "Failed to generate token." });
  }
};
