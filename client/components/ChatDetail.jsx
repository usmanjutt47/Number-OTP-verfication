import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import pusher from "../utils/pusherClient"; // Adjust path as necessary

const ChatDetail = () => {
  const route = useRoute();
  const { chatId, chatContent, senderName, timestamp, originalSenderId } =
    route.params;

  const [messages, setMessages] = useState([
    {
      id: chatId || Date.now(),
      text: chatContent || "",
      sender: senderName || "You",
      timestamp: timestamp || new Date().toLocaleTimeString(),
    },
  ]);
  const [messageText, setMessageText] = useState("");
  const [originalSender, setOriginalSender] = useState(null);

  useEffect(() => {
    const fetchOriginalSender = async () => {
      try {
        const response = await fetch(
          `http://192.168.100.6:8080/api/user/${originalSenderId}` // Replace with your endpoint
        );
        const senderData = await response.json();
        if (response.ok) {
          setOriginalSender(senderData);
        } else {
          console.error("Failed to fetch original sender details");
        }
      } catch (error) {
        console.error("Error fetching original sender details:", error);
      }
    };

    fetchOriginalSender();
  }, [originalSenderId]);

  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");
    channel.bind("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe("chat-channel");
    };
  }, []);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await fetch("http://192.168.100.140:8080/api/v1/auth/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "chat-channel",
          message: messageText,
        }),
      });

      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Chat Details</Text>
        {originalSender && (
          <View>
            <Text>Original Sender Name: {originalSender.name}</Text>
            <Text>Original Sender Email: {originalSender.email}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "You" ? styles.messageYou : styles.messageOther,
            ]}
          >
            <Text
              style={[
                styles.messageSender,
                item.sender === "You"
                  ? styles.messageSenderYou
                  : styles.messageSenderOther,
              ]}
            >
              {item.sender}
            </Text>
            <Text
              style={[
                styles.messageText,
                item.sender === "You"
                  ? styles.messageTextYou
                  : styles.messageTextOther,
              ]}
            >
              {item.text}
            </Text>
            <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id || Date.now().toString()} // Ensure id is a string
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image
            source={require("../assets/icons/send.png")} // Replace with your image path
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  heading: {
    marginTop: "8%",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    marginBottom: 10,
    maxWidth: "80%",
    alignSelf: "flex-start",
    paddingTop: 15,
    elevation: 3,
    backgroundColor: "#FEFEFE",
    marginLeft: 5,
    flexDirection: "column",
  },
  messageYou: {
    backgroundColor: "#075856",
    alignSelf: "flex-end",
  },
  messageOther: {
    elevation: 2,
    backgroundColor: "#FEFEFE",
  },
  messageSender: {
    fontFamily: "Outfit_Bold",
    marginBottom: 5,
    color: "#075856",
  },
  messageSenderYou: {
    color: "#fff",
  },
  messageSenderOther: {
    color: "#075856",
    fontSize: 16,
    fontFamily: "Outfit_Bold",
  },
  messageText: {
    fontSize: 16,
  },
  messageTextYou: {
    color: "#fff",
  },
  messageTextOther: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20,
    width: "100%",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#075856",
    padding: 10,
    borderRadius: 20,
  },
  image: {
    width: 24,
    height: 24,
  },
  messageList: {
    flexGrow: 1,
  },
});

export default ChatDetail;
