const express = require("express");
const router = express.Router();
const mailer = require("../utils/mailer");
const userModel = require("../models/user");
const letterModel = require("../models/letter");
const Letter = require("../models/letter");

router.post("/", async (req, res) => {
  try {
    const { senderId, content } = req.body;

    if (!senderId || !content) {
      return res
        .status(400)
        .json({ error: "Sender ID and content are required" });
    }

    const user = await userModel.findById(senderId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const users = await userModel.find({ _id: { $ne: senderId } });
    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No other users found to receive the letter" });
    }

    const receiverId = users[Math.floor(Math.random() * users.length)]._id;

    const letter = await letterModel.create({
      senderId,
      receiverId,
      content,
      title: "",
    });

    return res.status(201).json({ message: "Letter sent", letter });
  } catch (err) {
    console.error("Error in create-letter route:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/inbox/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({ error: "User ID is required" });
    }

    const lettersList = await Letter.find({
      receiverId: id,
      viewedId: { $ne: id },
    });

    const letters = await Promise.all(
      lettersList.map(async (letter) => {
        const sender = await User.findById(letter.senderId);

        return {
          ...letter._doc,
          sender,
        };
      })
    );

    return res.json(letters);
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.get("/sent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({ error: "User ID is required" });
    }

    const letters = await Letter.find({ senderId: id });

    return res.json(letters);
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.put("/toggle-favorite/:letterId", async (req, res) => {
  const { letterId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const letter = await Letter.findById(letterId);

    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isFavoriteLetters.includes(letterId)) {
      user.isFavoriteLetters.pull(letterId);
    } else {
      user.isFavoriteLetters.push(letterId);
    }

    await user.save();

    const action = user.isFavoriteLetters.includes(letterId)
      ? "marked as favorite"
      : "removed from favorites";

    res.status(200).json({ message: `Letter ${action}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId).populate("isFavoriteLetters");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isFavoriteLetters.length === 0) {
      return res.status(200).json({ message: "No favorites", favorites: [] });
    }

    res.status(200).json({ favorites: user.isFavoriteLetters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({ error: "Letter ID is required" });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return res.json({ error: "Letter not found" });
    }

    await Letter.findByIdAndDelete(id);

    return res.json({ message: "Letter deleted" });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.get("/all-excluding-creator/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const letters = await Letter.find({ senderId: { $ne: userId } });

    return res.status(200).json(letters);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({ error: "Letter ID is required" });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return res.json({ error: "Letter not found" });
    }

    return res.json({ letter });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

module.exports = router;
