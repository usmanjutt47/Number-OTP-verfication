import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const mockChats = [
  {
    id: "1",
    name: "Adam",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Elon",
    lastMessage: "Let’s catch up soon!",
    time: "9:45 AM",
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Elsa",
    lastMessage: "Can you send me that?",
    time: "8:00 AM",
    unreadCount: 0,
  },
  {
    id: "4",
    name: "Camila",
    lastMessage: "Meeting at 10 AM.",
    time: "Yesterday",
    unreadCount: 3,
  },
  {
    id: "5",
    name: "Ronaldo",
    lastMessage: "Great job on the project!",
    time: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "6",
    name: "Sophia",
    lastMessage: "Do you have time?",
    time: "Wednesday",
    unreadCount: 5,
  },
  {
    id: "7",
    name: "Liam",
    lastMessage: "Finished the report!",
    time: "Monday",
    unreadCount: 4,
  },
  {
    id: "8",
    name: "Olivia",
    lastMessage: "Let’s plan a trip.",
    time: "Sunday",
    unreadCount: 2,
  },
  {
    id: "9",
    name: "Noah",
    lastMessage: "Thanks for the help.",
    time: "Saturday",
    unreadCount: 1,
  },
  {
    id: "10",
    name: "Ava",
    lastMessage: "Are you free tomorrow?",
    time: "Friday",
    unreadCount: 6,
  },
];

const AllChats = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on the search query
  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.chatContainer}>
      <View style={styles.chatDetails}>
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatMessage}>{item.lastMessage}</Text>
        </View>
        <View style={styles.chatRightSection}>
          <Text style={styles.chatTime}>{item.time}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

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
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false} // Hide the scrollbar
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
    left: 15, // Ensure space for the icon
  },
  searchIcon: {
    position: "absolute",
    right: 20,
    color: "#AAAAB4", // Adjust as needed
  },
  chatList: {
    marginTop: 20,
  },
  chatContainer: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  chatDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatContent: {
    flex: 1,
  },
  chatRightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chatName: {
    fontFamily: "Outfit_Bold",
    fontSize: 16,
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
  },
  unreadCountContainer: {
    backgroundColor: "#075856",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  unreadCount: {
    color: "#FFF",
    fontFamily: "Outfit_Bold",
    fontSize: 12,
  },
});

export default AllChats;
