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
const responsivePadding = (size) => (size * width) / 375;

const AllChats = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        } else {
          setError(data.error || "Failed to fetch replies");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

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
    const letterSenderId = item.letterSenderId;
    const senderId = item.senderId;
    const receiverId = item.receiverId; // Extract receiverId

    console.log("Letter Sender ID:", letterSenderId);
    console.log("Message Sender ID:", senderId);
    console.log("Message Receiver ID:", receiverId); // Log receiverId

    navigation.navigate("ChatDetail", {
      chatId: item._id,
      chatContent: item.content,
      senderName: item.sender?.name || "Anonymous",
      timestamp: new Date(item.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      letterSenderId,
      letterReceiverId: receiverId, // Pass receiverId to ChatDetail
    });
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.chatContainer}
        onPress={() => handlePress(item)} // Use handlePress function
      >
        <View style={styles.chatDetails}>
          <View style={styles.chatContent}>
            <Text style={styles.chatName}>
              {item.sender?.name || "Anonymous"}
            </Text>
            <Text
              style={styles.chatMessage}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.content}
            </Text>
          </View>
          <View style={styles.chatRightSection}>
            <Text style={styles.chatTime}>
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

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
    height: "100%",
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
  },
  chatContent: {
    flex: 1,
  },
  chatRightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chatMessage: {
    fontFamily: "Outfit_Regular",
    fontSize: 14,
    color: "#AAAAB4",
  },
  chatTime: {
    fontFamily: "Outfit_Regular",
    fontSize: 12,
    color: "#AAAAB4",
    marginRight: 10,
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
});

export default AllChats;
