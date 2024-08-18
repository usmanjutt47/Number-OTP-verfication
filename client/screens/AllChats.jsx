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

const AllChats = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.100.6:8080/api/v1/auth/letters-of-subscribed-users"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.success) {
        setChats(data.replies);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); 
    }
  }, []);

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
      onPress={() => navigation.navigate("ChatDetail", { chatId: item._id })}
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

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
        <FlatList
          data={filteredChats}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing} 
        />
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
});

export default AllChats;
