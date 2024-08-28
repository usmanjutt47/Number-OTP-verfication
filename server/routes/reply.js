const express = require("express");
const router = express.Router();
const Reply = require("../models/Reply");
const Letter = require("../models/letter");
const User = require("../models/user");
const pusherInstance = require("../utils/pusher");
const Message = require("../models/messages");

router.post("/", async (req, res) => {
  try {
    const { senderId, content, letterId, receiverId } = req.body;

    if (!senderId || !content || !letterId || !receiverId) {
      return res.status(400).json({
        error: "Sender ID, content, letter ID, and receiver ID are required",
      });
    }

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Create the reply
    const reply = await Reply.create({
      senderId,
      content,
      letterId,
      receiverId,
      letterSenderId: letter.senderId,
    });

    // Update the letter to hide it
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
      return res
        .status(500)
        .json({ error: "Failed to send Pusher notification" });
    }

    // Return the response
    return res.json({ message: "Reply sent and letter hidden", reply });
  } catch (err) {
    console.error("Error sending reply:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/my-replies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sentRepliesList = await Reply.find({ senderId: userId }).populate(
      "letterId"
    );

    const receivedRepliesList = await Reply.find({
      receiverId: userId,
    }).populate({
      path: "letterId",
      match: { senderId: userId },
    });
    let unreadCount;

    // console.log({unreadCount})
    const filteredReceivedReplies = receivedRepliesList.filter(
      (reply) => reply.letterId
    );

    const allReplies = [...sentRepliesList, ...filteredReceivedReplies];

    allReplies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const uniqueReplyIds = [
      ...new Set(allReplies.map((reply) => reply._id.toString())),
    ];
    console.log({ uniqueReplyIds });

    // Fetch unread message counts for each unique replyId
    const unreadCounts = await Promise.all(
      uniqueReplyIds.map(async (replyId) => {
        const count = await Message.countDocuments({
          receiverId: userId,
          replyId: replyId,
          isRead: false,
        });
        return { replyId, count };
      })
    );

    console.log({ unreadCounts });

    const replies = await Promise.all(
      allReplies.map(async (reply) => {
        const sender = await User.findById(reply.senderId);
        const letter = reply.letterId;
        const letterSenderId = letter ? letter.senderId : null;

        return {
          ...reply._doc,
          sender,
          letterSenderId,
        };
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
  try {
    const { senderId, receiverId, replyId, messageContent } = req.body;
    console.log({ senderId, receiverId, replyId, messageContent });

    if (!senderId || !receiverId || !replyId || !messageContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = new Message({
      message: messageContent,
      replyId,
      senderId,
      receiverId,
    });
    await message.save();

    pusherInstance.trigger(`chat-${replyId}`, "message", {
      _id: message._id,
      senderId,
      receiverId,
      replyId,
      messageContent,
      createdAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages/:replyId", async (req, res) => {
  try {
    const { replyId } = req.params;

    const messages = await Message.find({ replyId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error retrieving messages:", err.message);
    res.status(500).json({ error: "Internal server error" });
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
