const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/meetingController");

router.post("/generate-token", generateToken);

module.exports = router;
