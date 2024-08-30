import React, { useState, useEffect, useRef } from "react";
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
import { getUserId } from "../utils/asyncStorage"; // Ensure correct import
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveMargin = (size) => (size * height) / 812;

const pusher = new Pusher("1851485", {
  cluster: "us2",
  encrypted: true,
  logToConsole: true,
});

const ChatDetail = () => {
  const route = useRoute();
  const { chatId, letterSenderId, letterReceiverId, chatContent, timestamp } =
    route.params;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [userId, setUserId] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
      } else {
        console.error("User ID not found");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.100.175:8080/api/reply/messages/${chatId}`
        );
        if (response.ok) {
          const initialMessages = await response.json();
          setMessages([
            {
              id: "initial",
              text: chatContent,
              sender: letterSenderId,
              timestamp: formatTime(timestamp),
              read: letterSenderId !== userId ? false : true,
            },
            ...initialMessages.map((msg) => ({
              id: msg._id,
              text: msg.message,
              sender: msg.senderId,
              timestamp: formatTime(msg.createdAt),
              read: false,
            })),
          ]);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 1000);

    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data._id,
          text: data.messageContent,
          sender: data.senderId,
          timestamp: formatTime(data.createdAt),
          read: false,
        },
      ]);
      setShouldAutoScroll(true);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      clearInterval(intervalId);
    };
  }, [chatId, userId]);

  useEffect(() => {
    if (shouldAutoScroll && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !userId || !letterReceiverId) return;

    const actualReceiverId =
      letterSenderId === userId ? letterReceiverId : letterSenderId;

    try {
      const response = await fetch(
        "http://192.168.100.175:8080/api/reply/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: userId,
            receiverId: actualReceiverId,
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
            sender: userId,
            timestamp: formatTime(new Date()),
            read: false,
          },
        ]);
        setMessageText("");
        setShouldAutoScroll(true);
      } else {
        const errorText = await response.text();
        console.error("Failed to send message:", errorText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markMessagesAsRead = () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.sender !== userId && !msg.read ? { ...msg, read: true } : msg
      )
    );
  };

  useEffect(() => {
    markMessagesAsRead();
  }, [userId]);

  const isSender = (senderId) => senderId === userId;

  const handleScroll = () => {
    setShouldAutoScroll(false);
  };

  const renderMessageHeader = (senderId) => {
    return isSender(senderId) ? (
      <Text style={[styles.messageHeader, { color: "#fff" }]}>You</Text>
    ) : (
      <Text style={[styles.messageHeader, { color: "#075856" }]}>
        Anonymous
      </Text>
    );
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
            color="#4a4a4a"
            style={styles.backIcon}
          />
        </Pressable>
        <Text
          style={{ color: "#000", fontFamily: "Outfit_Bold", fontSize: 25 }}
        >
          Anonymous
        </Text>
      </View>
      <View style={{ flex: 1, padding: 15, backgroundColor: "#f3f3f3" }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                isSender(item.sender)
                  ? styles.messageSender
                  : styles.messageReceiver,
              ]}
            >
              {renderMessageHeader(item.sender)}
              <Text
                style={[
                  styles.messageText,
                  isSender(item.sender)
                    ? styles.messageSenderText
                    : styles.messageReceiverText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onScrollBeginDrag={handleScroll}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={messageText}
            onChangeText={setMessageText}
          />
          {messageText.trim().length > 0 && (
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Image
                source={require("../assets/icons/send.png")}
                style={styles.sendImage}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    flexDirection: "row",
    height: responsiveHeight(30),
    alignItems: "center",
    width: "100%",
    height: responsiveHeight(100),
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingLeft: responsiveMargin(15),
    paddingRight: responsiveMargin(20),
    paddingTop: responsiveMargin(15),
  },
  backButton: {
    backgroundColor: "#F3F3F3",
    height: responsiveHeight(43),
    width: responsiveWidth(43),
    justifyContent: "center",
    borderRadius: 41,
    alignSelf: "center",
  },
  backIcon: {
    alignSelf: "center",
  },
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "80%",
    elevation: 2,
  },
  messageSender: {
    backgroundColor: "#075856",
    alignSelf: "flex-end",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
  },
  messageReceiver: {
    backgroundColor: "#FEFEFE",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageSenderText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  messageReceiverText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  messageHeader: {
    fontSize: 16,
    fontFamily: "Outfit_Semi_Bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 28,
    marginTop: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3e1e1",
    height: responsiveHeight(45),
    width: responsiveWidth(45),
    borderRadius: 30,
    position: "absolute",
    right: responsiveMargin(3),
    top: responsiveMargin(2),
  },
  sendImage: {
    width: 20,
    height: 20,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#929BA4",
    alignSelf: "flex-end",
    fontFamily: "Outfit_Regular",
    position: "absolute",
    bottom: 2,
    right: 19,
  },
});

export default ChatDetail;
