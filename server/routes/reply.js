const express = require("express");
const router = express.Router();
const Reply = require("../models/Reply");
const Letter = require("../models/letter");
const User = require("../models/user");
const pusherInstance = require("../utils/pusher");
const Message = require("../models/messages");

router.post("/", async (req, res) => {
  try {
    const { senderId, content, letterId, reciverId } = req.body;

    if (!senderId || !content || !letterId || !reciverId) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    const reply = new Reply({
      senderId,
      content,
      letterId,
      reciverId,
    });
    await reply.save();

    console.log({ senderId, content, letterId, reciverId });

    return res.status(201).json({ message: "Reply created", reply });
  } catch (err) {
    console.error("Error in reply route:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my-replies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sentReplies = await Reply.find({ senderId: userId }).populate(
      "letterId"
    );

    const receivedReplies = await Reply.find({ receiverId: userId }).populate(
      "letterId"
    );

    const allReplies = [...sentReplies, ...receivedReplies];

    allReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`Total replies found: ${allReplies.length}`);

    const replies = await Promise.all(
      allReplies.map(async (reply) => {
        const sender = await User.findById(reply.senderId);
        const letter = reply.letterId;

        const unreadCount = await Message.countDocuments({
          replyId: reply._id,
          receiverId: userId,
          isRead: false,
        });

        console.log(`Reply ID: ${reply._id}, Unread messages: ${unreadCount}`);

        return {
          ...reply._doc,
          sender,
          unreadMessagesCount: unreadCount,
        };
      })
    );

    console.log(
      `Processed ${replies.length} replies with unread message counts`
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

    const lettersReplies = await Reply.find({ reciverId: userId }).populate({
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
    console.log("Request Body:", req.body);

    const { senderId, replyId, messageContent } = req.body;

    if (!senderId || !replyId || !messageContent) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ReplyId se related reply record find karna
    const reply = await Reply.findById(replyId);
    if (!reply) {
      console.log("Reply not found");
      return res.status(404).json({ error: "Reply not found" });
    }

    // Reply record se receiverId ko set karna
    const receiverId = reply.reciverId;

    // Naya message create karna
    const message = new Message({
      message: messageContent,
      replyId,
      senderId,
      receiverId,
    });
    await message.save();

    console.log("Message saved:", message);

    // Pusher instance trigger karna
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
