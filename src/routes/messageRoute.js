const express =
  require("express");

const router =
  express.Router();

const {
  scheduleMessage,
} = require(
  "../controllers/messageController"
);

router.post(
  "/schedule",
  scheduleMessage
);

module.exports = router;