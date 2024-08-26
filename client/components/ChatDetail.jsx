import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Pusher from "pusher-js/react-native";
import { getUserId } from "../utils/asyncStorage";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * height) / 812;
const responsiveMargin = (size) => (size * height) / 812;

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
  const navigation = useNavigation();

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
      const senderId = await getUserId();
      if (!senderId) {
        console.error("Sender ID not found");
        return;
      }

      const response = await fetch(
        "http://192.168.100.175:8080/api/reply/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: senderId,
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
      <View
        style={{
          height: responsiveHeight(60),
          marginTop: responsiveMargin(15),
          marginBottom: responsiveMargin(15),
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#F0F0F1",
            height: responsiveHeight(52),
            width: responsiveWidth(52),
            justifyContent: "center",
            borderRadius: 41,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            style={{ alignSelf: "center" }}
          />
        </Pressable>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === letterReceiverId
                ? styles.messageReceiver
                : styles.messageSender,
            ]}
          >
            <Text
              style={[
                styles.messageSenderText,
                item.sender === letterReceiverId
                  ? styles.messageReceiverText
                  : styles.messageSenderText,
              ]}
            >
              {item.sender === letterReceiverId ? "You" : "Anonymous"}
            </Text>
            <Text
              style={[
                styles.messageText,
                item.sender === letterReceiverId
                  ? styles.messageReceiverText
                  : styles.messageSenderText,
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
        <Pressable
          style={{
            position: "absolute",
            justifyContent: "center",
            right: responsiveMargin(30),
            bottom: responsiveMargin(17),
          }}
          onPress={sendMessage}
        >
          <Image
            source={require("../assets/icons/send.png")}
            style={{
              height: responsiveHeight(20),
              width: responsiveWidth(20),
              alignSelf: "center",
            }}
          />
        </Pressable>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
    elevation: 2,
    marginLeft: responsiveMargin(5),
  },
  messageSender: {
    backgroundColor: "#FEFEFE", // White background for sender's messages
    alignSelf: "flex-start", // Sender's messages align to the left
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
  },
  messageReceiver: {
    backgroundColor: "#075856", // Green background for receiver's messages
    alignSelf: "flex-end", // Receiver's messages align to the right
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
  },
  messageSenderText: {
    color: "#000", // Black text for sender's messages
  },
  messageReceiverText: {
    color: "#fff",
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#fff",
    borderRadius: 28,
  },
  input: {
    flex: 1,
    borderRadius: 28,
    marginRight: 10,
    height: responsiveHeight(55),
    paddingLeft: 10,
    elevation: 2,
    backgroundColor: "#fff",
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
