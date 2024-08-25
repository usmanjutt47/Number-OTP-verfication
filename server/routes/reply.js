const express = require("express");
const router = express.Router();
const Reply = require("../models/Reply");
const Letter = require("../models/letter");
const User = require("../models/user");
const pusherInstance = require("../utils/pusher");

router.post("/", async (req, res) => {
  try {
    const { senderId, content, letterId, receiverId } = req.body;

    // Validate required fields
    if (!senderId || !content || !letterId || !receiverId) {
      return res.json({
        error: "Sender ID, content, letter ID, and receiver ID are required",
      });
    }

    // Find the letter
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.json({ error: "Letter not found" });
    }

    // Find the sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.json({ error: "Sender not found" });
    }

    // Find the receiver
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.json({ error: "Receiver not found" });
    }

    // Create the reply
    const reply = await Reply.create({
      senderId,
      content,
      letterId,
      receiverId,
    });

    // Update the letter to set hidden to true
    await Letter.findByIdAndUpdate(letterId, { hidden: true });

    // Trigger Pusher notification
    try {
      await pusherInstance.trigger("replies", "new-reply", {
        ...reply._doc,
        sender,
        receiver,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
      return res.json({ error: "Failed to send Pusher notification" });
    }

    return res.json({ message: "Reply sent and letter hidden", reply });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.get("/my-replies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const repliesList = await Reply.find({ senderId: userId });

    const replies = await Promise.all(
      repliesList.map(async (reply) => {
        const sender = await User.findById(reply.senderId);

        const replyData = {
          ...reply._doc,
          sender,
        };

        console.log("Reply Data:", replyData); // Log the reply data

        return replyData;
      })
    );

    return res.json(replies);
  } catch (err) {
    console.error("Error fetching user replies:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my-letters-replies/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const lettersReplies = await Reply.find({ senderId: userId }).populate({
      path: "letterId",
      select: "receiverId",
      populate: { path: "receiverId", select: "name" },
    });

    res.json(lettersReplies);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

router.post("/send-message", async (req, res) => {
  const { senderId, letterId, content } = req.body;
  console.log("Received data:", { senderId, letterId, content });

  if (!senderId || !letterId || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const letter = new Letter({
      senderId,
      receiverId: letterId,
      content,
    });
    await letter.save();
    res.status(200).json(letter);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
