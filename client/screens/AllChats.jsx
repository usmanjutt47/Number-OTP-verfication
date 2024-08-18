import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const AllChats = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReplies = async (letterId) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID is not available");
      }

      const response = await fetch(
        `http://192.168.100.6:8080/api/v1/auth/replies?letterId=${letterId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error("Failed to fetch replies:", error.message);
      setError("Failed to fetch replies");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const letterId = "66c058bb25c04a9f881e4639";
    if (letterId) {
      await fetchReplies(letterId);
    }
  }, []);

  useEffect(() => {
    const letterId = "66c058bb25c04a9f881e4639";
    if (letterId) {
      fetchReplies(letterId);
    }
  }, []);

  const renderReplyItem = ({ item }) => (
    <View style={styles.replyContainer}>
      <Text style={{ fontSize: 16, fontFamily: "Outfit_Medium" }}>
        Anonymous
      </Text>
      <Text style={styles.replyContent}>{item.content}</Text>
      {/* <Text style={styles.replyDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text> */}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              height: 52,
              width: 52,
              backgroundColor: "#e0e0e0",
              justifyContent: "center",
              borderRadius: 30,
            }}
          >
            <Entypo
              name="chevron-left"
              size={24}
              color="black"
              style={{ alignSelf: "center" }}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              fontFamily: "Outfit_Bold",
            }}
          >
            All chat
          </Text>
        </View>

        <View style={{ position: "relative", width: "100%" }}>
          <TextInput
            placeholder="Search message..."
            placeholderTextColor="#AAAAB4"
            style={{
              height: 52,
              paddingRight: 40,
              paddingLeft: "5%",
              borderRadius: 30,
              marginTop: "5%",
              borderWidth: 1,
              borderColor: "#D6D6D6",
            }}
          />

          <AntDesign
            name="search1"
            size={24}
            color="#BDBDC4"
            style={{
              position: "absolute",
              right: "5%",
              top: "60%",
              transform: [{ translateY: -12 }],
            }}
          />
        </View>

        <FlatList
          data={replies}
          renderItem={renderReplyItem}
          keyExtractor={(item) => item._id}
          style={styles.repliesList}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "5%",
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  replyContainer: {
    backgroundColor: "#F9F9F9",
    height: 63,
    borderRadius: 15,
    marginBottom: 5,
  },
  replyContent: {
    fontSize: 16,
  },
  replyDate: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
});

export default AllChats;
