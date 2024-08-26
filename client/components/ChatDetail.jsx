import React, { useState, useEffect } from "react";
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
import Pusher from "pusher-js/react-native";
import { getUserId } from "../utils/asyncStorage";

// Pusher setup
const pusher = new Pusher(
  "pk_test_51PnyvfDw0HZ2rXEfHszzvJJfoiyLWKUpejcAP2xOWWkwj3e6eflY3zWFN8OK69FS9NLQPaoz2P1XcZ1XK3OVO79K00Avrtb4N6",
  {
    cluster: "us2",
    encrypted: true,
  }
);

const ChatDetail = () => {
  const route = useRoute();
  const {
    chatId,
    chatContent,
    senderName,
    timestamp,
    letterSenderId,
    letterReceiverId,
  } = route.params;

  const [messages, setMessages] = useState([
    {
      id: chatId || Date.now(),
      text: chatContent || "",
      sender: senderName || "You",
      timestamp: timestamp || new Date().toLocaleTimeString(),
    },
  ]);
  const [messageText, setMessageText] = useState("");

  // Listen for new messages
  useEffect(() => {
    const channel = pusher.subscribe("chat");

    channel.bind("new-message", (data) => {
      if (data.replyId === chatId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data._id,
            text: data.message,
            sender: data.senderId,
            timestamp: data.createdAt,
          },
        ]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      // Retrieve the logged-in user ID
      const senderId = await getUserId();
      if (!senderId) {
        console.error("Sender ID not found");
        return;
      }

      const response = await fetch(
        "http://192.168.10.5:8080/api/reply/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: senderId, // Use the retrieved sender ID
            receiverId: letterReceiverId,
            replyId: chatId,
            messageContent: messageText,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: responseData._id,
            text: messageText,
            sender: senderId,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        setMessageText("");
        console.log("Message sent successfully!");
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to send message. Server responded with:",
          errorText
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Chat Details</Text>
        <View>
          <Text>Letter Sender ID: {letterSenderId}</Text>
          <Text>Letter Receiver ID: {letterReceiverId}</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === letterSenderId
                ? styles.messageYou
                : styles.messageOther,
            ]}
          >
            <Text
              style={[
                styles.messageSender,
                item.sender === letterSenderId
                  ? styles.messageSenderYou
                  : styles.messageSenderOther,
              ]}
            >
              {item.sender === letterSenderId ? "You" : item.sender}
            </Text>
            <Text
              style={[
                styles.messageText,
                item.sender === letterSenderId
                  ? styles.messageTextYou
                  : styles.messageTextOther,
              ]}
            >
              {item.text}
            </Text>
            <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Image
            source={require("../assets/icons/send.png")}
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
