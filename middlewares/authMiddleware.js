const express = require("express")
const { OAuth2Client } = require("google-auth-library")
const dotenv = require("dotenv")
dotenv.config()

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Google Login Route
router.post("/google-login", async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ error: "Google token is required" })
        }

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()

        if (!payload) {
            return res.status(401).json({ error: "Invalid Google token" })
        }

        // Send user details to frontend
        return res.json({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        })
    } catch (error) {
        console.error("Google Auth Error:", error)
        return res.status(500).json({ error: "Internal Server Error", details: error.message })
    }
})

module.exports = router
