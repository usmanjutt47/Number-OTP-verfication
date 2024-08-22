const express = require("express");
const router = express.Router();
const Reply = require("../models/reply");
const Letter = require("../models/letter");
const User = require("../models/user");
const pusherInstance = require("../utils/pusher");

router.post("/", async (req, res) => {
  try {
    const { senderId, content, letterId } = req.body;

    if (!senderId || !content || !letterId) {
      return res.json({
        error: "Sender ID, content, and letter ID are required",
      });
    }

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.json({ error: "Letter not found" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.json({ error: "Sender not found" });
    }

    const reply = await Reply.create({ senderId, content, letterId });

    try {
      await pusherInstance.trigger("replies", "new-reply", {
        ...reply._doc,
        sender,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
      return res.json({ error: "Failed to send Pusher notification" });
    }

    return res.json({ message: "Reply sent" });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.get("/letter/:id", async (req, res) => {
  console.log("Received request for letter ID:", req.params.id);
  try {
    const { id } = req.params;

    if (!id) {
      console.log("Error: Letter ID is required");
      return res.send({ error: "Letter ID is required" });
    }

    const repliesList = await Reply.find({ letterId: id });

    const replies = await Promise.all(
      repliesList.map(async (reply) => {
        const sender = await User.findById(reply.senderId);

        return {
          ...reply._doc,
          sender,
        };
      })
    );

    return res.json(replies);
  } catch (err) {
    console.error("Error:", err.message);
    return res.json({ error: err.message });
  }
});

router.put("/letter/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Letter ID is required" });
    }

    await Reply.updateMany({ letterId: id }, { isRead: true });

    return res.json({ message: "Replies marked as read" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
