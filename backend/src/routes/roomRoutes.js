const express = require("express");

const router = express.Router();

const {createRoom,joinRoom,getRoom} = require("../controllers/roomController");
// const { getRoom } = require("../services/roomService");

router.post("/",createRoom);
router.post("/:roomId/join",joinRoom);
router.get("/:roomId",getRoom);

module.exports = router;