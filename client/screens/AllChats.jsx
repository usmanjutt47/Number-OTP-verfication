import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTopNav from "../components/CustomTopNav";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import { debounce } from "lodash";
import { SERVER_URL } from "@env";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveIconSize = (size) => (size * width) / 375;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveMargin = (size) => (size * height) / 812;
const responsivePadding = (size) => (size * width) / 375;

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AllChats = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { setTotalUnreadMessages } = useUnreadMessages();
  const [currentChatId, setCurrentChatId] = useState(null);

  const fetchUserReplies = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`${SERVER_URL}/reply/my-replies/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user replies");
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      return [];
    }
  };

  const fetchUserLettersReplies = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(
        `${SERVER_URL}/reply/my-letters-replies/${userId}`
      );
      if (!response.ok)
        throw new Error("Failed to fetch user letters and unread messages");
      const data = await response.json();
      return {
        lettersReplies: data.lettersReplies,
        unreadMessages: data.unreadMessages,
      };
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      return { lettersReplies: [], unreadMessages: [] };
    }
  };

  const fetchAllReplies = async () => {
    setLoading(true);
    const userReplies = await fetchUserReplies();
    const { lettersReplies, unreadMessages } = await fetchUserLettersReplies();

    const combinedChats = [...userReplies, ...lettersReplies];

    const unreadCounts = {};

    combinedChats.forEach((chat) => {
      unreadCounts[chat._id] = 0;
    });

    unreadMessages.forEach((msg) => {
      if (!msg.isRead) {
        const chatId = msg.replyId;
        if (unreadCounts[chatId] !== undefined) {
          unreadCounts[chatId]++;
        }
      }
    });

    const totalUnread = Object.values(unreadCounts).reduce(
      (acc, count) => acc + count,
      0
    );
    setTotalUnreadMessages(totalUnread);

    setChats(combinedChats);
    setUnreadCounts(unreadCounts);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllReplies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllReplies().finally(() => setRefreshing(false));
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      chat.content &&
      typeof chat.content === "string" &&
      chat.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markChatAsRead = async (chatId) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/reply/mark-as-read/${chatId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to mark chat as read");
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (currentChatId !== null) {
      console.log("Current Chat ID updated to:", currentChatId);
    }
  }, [currentChatId]);

  const debouncedHandlePress = useCallback(
    debounce(async (item) => {
      if (currentChatId === item._id) return;
      console.log("Handling press for:", item._id);

      setCurrentChatId(item._id);
      await markChatAsRead(item._id);

      console.log("Navigating with chatId:", item._id);
      navigation.navigate("ChatDetail", {
        chatId: item._id,
        chatContent: item.content || "No content",
        senderName: item.senderId || "Anonymous",
        timestamp: item.createdAt,
        letterSenderId: item.senderId,
        letterReceiverId: item.reciverId,
      });
    }, 300),
    [currentChatId, navigation, markChatAsRead]
  );

  const handlePress = (item) => {
    debouncedHandlePress(item);
  };

  const renderItem = ({ item }) => {
    const unreadCount = unreadCounts[item._id] || 0;

    return (
      <Pressable style={styles.chatContainer} onPress={() => handlePress(item)}>
        <View style={styles.chatDetails}>
          <TouchableOpacity
            style={styles.chatContent}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.name}>{item.sender?.name || "Anonymous"}</Text>
            <Text
              style={styles.chatMessage}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.content} 💬
            </Text>
          </TouchableOpacity>
          <View contentContainerStyle={styles.chatRightSection}>
            <Text style={styles.chatTime}>{formatTime(item.createdAt)}</Text>
            {unreadCount > 0 && (
              <Pressable style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ padding: "5%" }}>
        <CustomTopNav />
      </View>

      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#075856" />
          </View>
        ) : filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={{ flex: 1 }}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        ) : (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.imageWrapper}>
                <Animated.View
                  style={[
                    styles.circle,
                    { transform: [{ scale: scaleValue }] },
                  ]}
                />
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../assets/icons/noChat.png")}
                    style={{
                      height: responsiveHeight(120),
                      width: responsiveWidth(120),
                      tintColor: "#fff",
                    }}
                  />
                </View>
              </View>
              <Text style={styles.modalHeading}>Empty Chat!</Text>
              <Text style={styles.modalText}>
                Your chat is empty. Reach out to someone and get the
                conversation going!
              </Text>
            </View>
          </View>
        )}
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate("WriteLetter")}
      >
        <Image
          source={require("../assets/icons/add.png")}
          style={{ height: responsiveHeight(25), width: responsiveWidth(25) }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  contentContainer: {
    paddingHorizontal: responsivePadding(20),
    paddingBottom: responsivePadding(20),
    flex: 1,
  },
  chatContainer: {
    backgroundColor: "#fff",
    minHeight: 63,
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  chatDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsivePadding(15),
  },
  chatContent: {
    width: "70%",
  },
  name: {
    color: "#000",
    fontFamily: "Outfit_Bold",
    fontSize: responsiveFontSize(14),
    marginBottom: 3,
  },
  chatMessage: {
    color: "#000",
    fontFamily: "Outfit_Regular",
    fontSize: responsiveFontSize(12),
  },
  chatRightSection: {
    alignItems: "flex-end",
  },
  chatTime: {
    color: "#8a8a8a",
    fontFamily: "Outfit_Regular",
    fontSize: responsiveFontSize(12),
  },
  badge: {
    height: 24,
    width: 24,
    backgroundColor: "#ff6347",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Outfit_Regular",
  },
  modalOverlay: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    height: "100%",
    width: "100%",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeading: {
    fontSize: responsiveFontSize(20),
    fontFamily: "Outfit_Bold",
    marginVertical: responsiveMargin(15),
    textAlign: "center",
  },
  modalText: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Outfit_Regular",
    textAlign: "center",
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    height: 160,
    width: 160,
    borderRadius: 80,
    backgroundColor: "#43bf91",
    opacity: 0.2,
    position: "absolute",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    position: "absolute",
    bottom: responsiveHeight(20),
    right: responsiveWidth(20),
    backgroundColor: "#075856",
    borderRadius: 50,
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllChats;
