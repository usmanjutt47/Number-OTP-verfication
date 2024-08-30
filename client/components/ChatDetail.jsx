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
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Pusher from "pusher-js/react-native";
import { getUserId } from "../utils/asyncStorage"; // Ensure correct import
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "@env";

const { width, height } = Dimensions.get("window");
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveMargin = (size) => (size * height) / 812;

const pusher = new Pusher("fd4b5a435caa149d3a10", {
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
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
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
        const response = await fetch(`${SERVER_URL}/reply/messages/${chatId}`);
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

    const channel = pusher.subscribe(`chat-${chatId}`);

    const handleMessage = (data) => {
      setMessages((prevMessages) => {
        // Check if the message already exists
        if (prevMessages.some((msg) => msg.id === data._id)) {
          return prevMessages;
        }

        return [
          ...prevMessages,
          {
            id: data._id,
            text: data.messageContent,
            sender: data.senderId,
            timestamp: formatTime(data.createdAt),
            read: false,
          },
        ];
      });
      setShouldAutoScroll(true);
    };

    channel.bind("message", handleMessage);

    return () => {
      channel.unbind("message", handleMessage);
      channel.unsubscribe();
    };
  }, [chatId, userId]);

  useEffect(() => {
    if (shouldAutoScroll && !isManualScrolling && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, shouldAutoScroll, isManualScrolling]);

  const sendMessage = async () => {
    if (!messageText.trim() || !userId || !letterReceiverId || isSending)
      return;

    setIsSending(true);

    const actualReceiverId =
      letterSenderId === userId ? letterReceiverId : letterSenderId;

    try {
      const response = await fetch(`${SERVER_URL}/reply/send-message`, {
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
      });

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
    } finally {
      setIsSending(false);
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

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const contentHeight = contentSize.height;
    const layoutHeight = layoutMeasurement.height;
    const offsetY = contentOffset.y;

    // Check if the user is scrolling close to the bottom
    setIsManualScrolling(offsetY + layoutHeight < contentHeight - 100);
    setShouldAutoScroll(offsetY + layoutHeight >= contentHeight - 100);
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
          keyExtractor={(item, index) =>
            `${item.id || item.timestamp}-${index}`
          } // Ensure unique key
          contentContainerStyle={styles.messageList}
          onScroll={handleScroll}
          onScrollBeginDrag={() => setIsManualScrolling(true)}
          onScrollEndDrag={() => setIsManualScrolling(false)}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={messageText}
            onChangeText={setMessageText}
          />
          {messageText.trim().length > 0 && !isSending && (
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
