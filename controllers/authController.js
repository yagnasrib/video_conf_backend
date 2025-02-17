const { OAuth2Client } = require("google-auth-library");
require("dotenv").config(); // Ensure dotenv is loaded

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Get client ID from .env
const client = new OAuth2Client(CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Ensure this matches your frontend CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    // Debugging
    console.log("Decoded Token Payload:", payload);

    if (payload.aud !== CLIENT_ID) {
      return res.status(403).json({ error: "Token audience mismatch" });
    }

    res.json({ message: "Google login successful", user: payload });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

module.exports = { verifyGoogleToken };
