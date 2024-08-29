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
  Easing,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import CustomTopNav from "../components/CustomTopNav";

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

  const fetchUserReplies = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await fetch(
        `http://192.168.100.6:8080/api/reply/my-replies/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user replies");
      }
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
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `http://192.168.100.6:8080/api/reply/my-letters-replies/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user letters replies");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      return [];
    }
  };

  const fetchAllReplies = async () => {
    setLoading(true);
    const userReplies = await fetchUserReplies();
    const userLettersReplies = await fetchUserLettersReplies();
    const combinedData = [...userReplies, ...userLettersReplies];
    setChats(combinedData);
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

  const handlePress = (item) => {
    console.log("Item:", item); // Console mein item ki details dekhne ke liye

    navigation.navigate("ChatDetail", {
      chatId: item._id,
      chatContent: item.latestReply || item.content || "No content",
      senderName: item.sender?.name || "Anonymous",
      timestamp: item.createdAt,
      letterSenderId: item.letterSenderId,
      letterReceiverId: item.letterReceiverId, // `letterReceiverId` aur `letterSenderId` ko sahi assign karein
    });
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.chatContainer} onPress={() => handlePress(item)}>
      <View style={styles.chatDetails}>
        <View style={styles.chatContent}>
          <Text style={{ fontSize: 16, fontFamily: "Outfit_Medium" }}>
            {item.sender?.name || "Anonymous"}
          </Text>
          <Text
            style={styles.chatMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            <Text>{item.content} 💬</Text>
          </Text>
        </View>
        <View style={styles.chatRightSection}>
          <Text style={styles.chatTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    </Pressable>
  );

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
            keyExtractor={(item, index) => `${item._id}-${index}`}
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
            </View>
          </View>
        )}
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate("WriteLetter")}
      >
        <Entypo name="plus" size={40} color="white" />
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
    fontSize: 14,
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
    width: responsiveWidth(90),
    height: responsiveHeight(90),
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
});

export default AllChats;
