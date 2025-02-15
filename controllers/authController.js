const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual Client ID
const client = new OAuth2Client(CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body; // Ensure token is sent in request body

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({ message: "Google login successful", user: payload });
  } catch (error) {
    res.status(401).json({ error: "Invalid Google token" });
  }
};

module.exports = { verifyGoogleToken };
