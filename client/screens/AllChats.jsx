import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
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

  const fetchUserReplies = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `http://192.168.10.5:8080/api/reply/my-replies/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setChats(data);
        const counts = data.reduce((acc, chat) => {
          acc[chat._id] = chat.unreadCount || 0;
          return acc;
        }, {});
        setUnreadCounts(counts);
      } else {
        setError(data.error || "Failed to fetch replies");
        console.error("Error fetching replies:", data.error);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Error occurred:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReplies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserReplies().finally(() => setRefreshing(false));
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      chat.content &&
      typeof chat.content === "string" &&
      chat.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePress = (item) => {
    navigation.navigate("ChatDetail", {
      chatId: item._id,
      chatContent: item.content,
      senderName: item.sender?.name || "Anonymous",
      chatContent: item.latestReply || item.content || "No content",
      timestamp: item.createdAt,
      letterSenderId: item.letterSenderId,
      letterReceiverId: item.receiverId,
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
          {unreadCounts[item._id] > 0 && (
            <Pressable style={styles.badge} onPress={() => handlePress(item)}>
              <Text style={styles.badgeText}>{unreadCounts[item._id]}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ padding: "5%" }}>
        <CustomTopNav />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search message..."
            placeholderTextColor="#AAAAB4"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
          <Ionicons
            name="search-outline"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        </View>
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
          <View style={styles.noChatsContainer}>
            <Text style={styles.noChatsText}>You have currently no chats.</Text>
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
    alignItems: "center",
    backgroundColor: "#bcbaba",
  },
  contentContainer: {
    width: "90%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 10,
    borderColor: "#D6D6D6",
    borderWidth: 1,
    marginTop: 20,
    position: "relative",
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
  },
  chatContainer: {
    backgroundColor: "#F9F9F9",
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
    marginTop: 20,
  },
  noChatsText: {
    fontFamily: "Outfit_Regular",
    fontSize: 16,
    color: "#fff",
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
});

export default AllChats;
