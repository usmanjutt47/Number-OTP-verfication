import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;

export default function ReplyLetter() {
  const [replyContent, setReplyContent] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const [letters, setLetters] = useState([]);

  const { selectedItem } = route.params || {};

  const handleReply = async () => {
    try {
      const senderId = await AsyncStorage.getItem("userId");

      if (!senderId) {
        Alert.alert("Error", "User ID not found");
        return;
      }

      if (!replyContent.trim()) {
        Alert.alert("Error", "Content cannot be empty");
        return;
      }

      if (!selectedItem || !selectedItem._id || !selectedItem.senderId) {
        Alert.alert("Error", "No item selected or missing required IDs");
        return;
      }

      // reciverId mein letter ki senderId save kar rahe hain
      const reciverId = selectedItem.senderId;

      // Logging the data before sending the request
      console.log({
        senderId: senderId,
        content: replyContent,
        letterId: selectedItem._id,
        reciverId: reciverId, // Letter senderId saved as reciverId
      });

      const response = await fetch("http://192.168.100.6:8080/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          content: replyContent,
          letterId: selectedItem._id,
          reciverId: reciverId, // Send the letter's senderId as reciverId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Reply sent successfully");
        setReplyContent("");

        // Update local state to hide the letter
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === selectedItem._id
              ? { ...letter, hidden: true }
              : letter
          )
        );

        navigation.navigate("Home");
      } else {
        Alert.alert("Error", `Error: ${result.error || result.message}`);
        console.error("Backend Error:", result);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to send reply: ${error.message}`);
      console.error("Catch Error:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <MaterialIcons name="mail-outline" size={20} color="#000" />
          <Text style={styles.headerText}>Write Reply</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            multiline
            value={replyContent}
            onChangeText={setReplyContent}
            placeholder="Type here..."
            placeholderTextColor={"#000"}
            cursorColor={"#000"}
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleReply}>
            <Text style={styles.sendButtonText}>Send Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#BCBABA",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    height: "90%",
    paddingLeft: "5%",
    backgroundColor: "#ffffff",
    borderRadius: 23,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: "5%",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Inter_Bold",
    marginLeft: "5%",
    fontSize: 24,
    fontWeight: "bold",
  },
  textInput: {
    fontFamily: "Outfit_Regular",
    marginTop: "5%",
    fontSize: 18,
    paddingRight: 20,
    width: "70%",
    textAlign: "justify",
  },
  sendButton: {
    backgroundColor: "#075856",
    width: "90%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "2%",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: responsiveHeight(50),
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(24),
    color: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    fontSize: responsiveFontSize(26),
    fontFamily: "Outfit_Regular",
    width: "100%",
    color: "#000",
    minHeight: responsiveHeight(200),
    borderBottomColor: "#ccc",
  },
  sendButtonText: {
    textAlign: "center",
    fontSize: responsiveFontSize(18),
    color: "#fff",
  },
});
