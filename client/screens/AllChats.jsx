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
  Easing,
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

    useEffect(() => {
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      scaleAnimation.start();

      return () => scaleAnimation.stop();
    }, [scaleValue]);

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
          <View style={styles.chatRightSection}>
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

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scaleAnimation.start();

    return () => scaleAnimation.stop();
  }, [scaleValue]);

  return (
    <View style={styles.container}>
      <View style={{ padding: "5%" }}>
        <CustomTopNav />
      </View>

      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#075856" />
        ) : filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={styles.chatList}
            showsVerticalScrollIndicator={false}
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
                      height: responsiveHeight(23),
                      width: responsiveHeight(23),
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
              <View
                style={{
                  alignItems: "center",
                  width: "90%",
                  position: "absolute",
                  bottom: "5%",
                }}
              ></View>
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
    width: "100%",
    height: "100%",
  },
  searchInput: {
    height: 52,
    flex: 1,
    fontFamily: "Outfit_Regular",
    fontSize: 16,
    left: 15,
  },
  searchIcon: {
    position: "absolute",
    right: 20,
    color: "#AAAAB4",
  },
  chatList: {
    marginTop: 20,
    padding: "5%",
  },
  chatContainer: {
    backgroundColor: "#fff",
    height: 63,
    borderRadius: 15,
    marginBottom: 10,
  },
  chatDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    height: "100%",
    width: "100%",
  },
  chatContent: {
    flex: 1,
    alignSelf: "center",
    height: "100%",
    justifyContent: "center",
  },
  chatRightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 20,
  },
  chatMessage: {
    fontFamily: "Outfit_Regular",
    fontSize: 12,
    color: "#AAAAB4",
    alignItems: "center",
  },
  chatTime: {
    fontFamily: "Outfit_Regular",
    fontSize: 12,
    color: "#AAAAB4",
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    fontFamily: "Outfit_Regular",
    fontSize: 16,
    color: "#000",
    textAlign: "center",
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
  badge: {
    height: 20,
    width: 20,
    backgroundColor: "#075856",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Outfit_Regular",
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    height: "100%",
    width: "100%",
    marginTop: responsiveMargin(200),
  },
  modalContent: {
    width: "90%",
    height: responsiveHeight(200),
    backgroundColor: "#fff",
    borderRadius: 41,
    alignItems: "center",
  },
  imageWrapper: {
    marginTop: responsiveMargin(15),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: responsiveWidth(85),
    height: responsiveHeight(85),
    borderRadius: 100,
    backgroundColor: "#E6eeee",
  },
  imageContainer: {
    width: responsiveWidth(80),
    height: responsiveHeight(80),
    backgroundColor: "#075856",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  modalText: {
    fontFamily: "Outfit_Regular",
    fontSize: responsiveFontSize(12),
    width: "90%",
    textAlign: "center",
  },
  modalHeading: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(20),
    marginTop: responsivePadding(23),
  },
  name: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Outfit_Medium",
  },
});

export default AllChats;
