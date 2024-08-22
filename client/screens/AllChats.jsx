import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllChats = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRefreshing(true);

    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.warn("No userId found in AsyncStorage");
        setError("No userId found in AsyncStorage");
        return;
      }

      // Fetch data from API
      const response = await fetch(
        `http://192.168.100.140:8080/api/v1/auth/letters-of-subscribed-users?userId=${userId}`
      );

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      // Parse response data
      const data = await response.json();

      // Handle success and update state
      if (data.success) {
        setChats(data.replies || []);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      // Log the error and update state
      console.error("Error fetching chats:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.content &&
      typeof chat.content === "string" &&
      chat.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.chatContainer}
      onPress={() =>
        navigation.navigate("ChatDetail", {
          chatId: item._id,
          chatContent: item.content,
          senderName: "Anonymous",
          timestamp: new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        })
      }
    >
      <View style={styles.chatDetails}>
        <View style={styles.chatContent}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Outfit_Medium",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            Anonymous
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.heading}>All Chats</Text>
        </View>
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
        {filteredChats.length > 0 ? (
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
            <Text style={styles.noChatsText}>
              You have currently no plan active.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    backgroundColor: "#fff",
  },
  contentContainer: {
    width: "90%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    marginTop: "10%",
    alignItems: "center",
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  heading: {
    fontFamily: "Outfit_Bold",
    fontSize: 20,
    marginLeft: "5%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    color: "#AAAAB4",
    textAlign: "center",
  },
});

export default AllChats;
