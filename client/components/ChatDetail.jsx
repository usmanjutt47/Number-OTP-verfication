import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Pusher from "pusher-js/react-native";
import { getUserId } from "../utils/asyncStorage";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;

const pusher = new Pusher("1851485", {
  cluster: "us2",
  encrypted: true,
});

const ChatDetail = () => {
  const route = useRoute();
  const { chatId, letterSenderId, letterReceiverId } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.100.6:8080/api/reply/messages/${chatId}`
        );
        if (response.ok) {
          const initialMessages = await response.json();
          setMessages(
            initialMessages.map((msg) => ({
              id: msg._id,
              text: msg.message,
              sender: msg.senderId,
              timestamp: new Date(msg.createdAt).toLocaleTimeString(),
            }))
          );
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const channel = pusher.subscribe("chat");

    channel.bind("message", (data) => {
      if (data.replyId === chatId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data._id,
            text: data.messageContent,
            sender: data.senderId,
            timestamp: new Date(data.createdAt).toLocaleTimeString(),
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
        "http://192.168.100.6:8080/api/reply/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId,
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
      } else {
        const errorText = await response.text();
        console.error("Failed to send message:", errorText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            style={styles.backIcon}
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
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Image
            source={require("../assets/icons/send.png")}
            style={styles.sendImage}
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
  header: {
    height: responsiveHeight(60),
    marginTop: 15,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#F0F0F1",
    height: responsiveHeight(52),
    width: responsiveWidth(52),
    justifyContent: "center",
    borderRadius: 41,
  },
  backIcon: {
    alignSelf: "center",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
    elevation: 2,
  },
  messageSender: {
    backgroundColor: "#FEFEFE",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  messageReceiver: {
    backgroundColor: "#075856",
    alignSelf: "flex-end",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  messageText: {
    fontSize: 16,
  },
  messageSenderText: {
    color: "#000",
  },
  messageReceiverText: {
    color: "#fff",
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
    borderRadius: 28,
    marginTop: 10,
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
    justifyContent: "center",
    alignItems: "center",
  },
  sendImage: {
    height: responsiveHeight(20),
    width: responsiveWidth(20),
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});

export default ChatDetail;
