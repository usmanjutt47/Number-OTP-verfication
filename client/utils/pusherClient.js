import Pusher from "pusher-js/react-native"; // Ensure you're using the correct import

// Initialize Pusher with your app credentials
const pusher = new Pusher("1851485", {
  cluster: "us2",
  forceTLS: true, // Use forceTLS if needed; set to false if you don't use SSL/TLS
});

export default pusher;
