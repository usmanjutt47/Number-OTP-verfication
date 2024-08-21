import { Hono } from "hono";
import Letter from "../models/letter";
import User from "../models/user";

const letter = new Hono();

letter.post("/", async (c) => {
  try {
    const { senderId, content, title } = await c.req.json();

    if (!senderId || !content || !title) {
      return c.json({ error: "Sender ID, content, and title are required" });
    }

    const user = await User.findById(senderId);

    if (!user) {
      return c.json({ error: "User not found" });
    }

    const users = await User.find({ _id: { $ne: senderId } });

    const receiverId = users[Math.floor(Math.random() * users.length)]._id;

    const letter = await Letter.create({
      senderId,
      receiverId,
      content,
      title,
    });

    return c.json({ message: "Letter sent", letter });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

letter.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Letter ID is required" });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return c.json({ error: "Letter not found" });
    }

    return c.json({ letter });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

letter.get("/inbox/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "User ID is required" });
    }

    const lettersList = await Letter.find({
      receiverId: id,
      viewedId: { $ne: id },
    });

    const letters = await Promise.all(
      lettersList.map(async (letter) => {
        const sender = await User.findById(letter.senderId);

        return {
          ...letter,
          sender,
        };
      })
    );

    return c.json(letters);
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

letter.get("/sent/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "User ID is required" });
    }

    const letters = await Letter.find({ senderId: id });

    return c.json(letters);
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

letter.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Letter ID is required" });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return c.json({ error: "Letter not found" });
    }

    await Letter.findByIdAndUpdate(id, { isFavorite: true });

    return c.json({ message: "Letter added to favorites" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

letter.delete("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Letter ID is required" });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return c.json({ error: "Letter not found" });
    }

    await Letter.findByIdAndDelete(id);

    return c.json({ message: "Letter deleted" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

export default letter;
