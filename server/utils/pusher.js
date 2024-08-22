const Pusher = require("pusher");

const pusherInstance = new Pusher({
  appId: process.env.PUSHER_APP_ID || "default_app_id",
  key: process.env.PUSHER_KEY || "default_key",
  secret: process.env.PUSHER_SECRET || "default_secret",
  cluster: process.env.PUSHER_CLUSTER || "default_cluster",
  useTLS: true,
});

module.exports = pusherInstance;
