const express = require("express");
const { generateToken, getHost, setHost } = require("../controllers/meetingController"); // ✅ Import functions

const router = express.Router();

router.post("/generate-token", generateToken);
router.get("/:roomID/host", getHost); // ✅ Get host of a room
router.post("/:roomID/set-host", setHost); // ✅ Set the host for a room

module.exports = router;
