const express = require("express");
const verifyGoogleToken = require("../middlewares/authMiddleware");
const User = require("../models/usermodels");

const router = express.Router();

router.post("/google-login", verifyGoogleToken, async (req, res) => {
    try {
        console.log("Google Login Request Received");
        console.log("Decoded User Info:", req.user);

        if (!req.user) {
            return res.status(400).json({ error: "User not found in request" });
        }

        const { name, email, picture } = req.user;

        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found. Creating a new user...");
            user = await User.create({ name, email, picture });
        }

        console.log("User Login Successful:", user);
        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;
