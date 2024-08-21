import { Hono } from "hono";
import Reply from "../models/reply";
import User from "../models/user";
import pusherInstance from "../utils/pusher";

const reply = new Hono();

reply.post("/", async (c) => {
  try {
    const { senderId, content, letterId } = await c.req.json();

    if (!senderId || !content || !letterId) {
      return c.json({
        error: "Sender ID, content, and letter ID are required",
      });
    }

    const reply = await Reply.create({ senderId, content, letterId });

    await pusherInstance.trigger("replies", "new-reply", reply);

    return c.json({ message: "Reply sent" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

reply.get("/letter/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Letter ID is required" });
    }

    const repliesList = await Reply.find({ letterId: id });

    const replies = await Promise.all(
      repliesList.map(async (reply) => {
        const sender = await User.findById(reply.senderId);

        return {
          ...reply,
          sender,
        };
      })
    );

    return c.json(replies);
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

reply.put("/letter/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Reply ID is required" });
    }

    await Reply.updateMany({ letterId: id }, { isRead: true });

    return c.json({ message: "Replies marked as read" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

export default reply;
