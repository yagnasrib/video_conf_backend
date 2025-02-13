const express = require("express");
const { createRoom, joinRoom, getRoomInfo } = require("../controllers/roomControllers");

const router = express.Router();

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/:roomId", getRoomInfo);

module.exports = router;
