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
import { SERVER_URL } from "@env";
import Toast from "react-native-toast-message";

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
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "User ID not found",
        });
        return;
      }

      if (!replyContent.trim()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Content cannot be empty",
        });
        return;
      }

      if (!selectedItem || !selectedItem._id || !selectedItem.senderId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No item selected or missing required IDs",
        });
        return;
      }

      const reciverId = selectedItem.senderId;

      const response = await fetch(`${SERVER_URL}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          content: replyContent,
          letterId: selectedItem._id,
          reciverId: reciverId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Reply sent successfully",
        });

        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);

        setReplyContent("");

        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === selectedItem._id
              ? { ...letter, hidden: true }
              : letter
          )
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `Error: ${result.error || result.message}`,
        });
        console.error("Backend Error:", result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to send reply: ${error.message}`,
      });
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
      <Toast />
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
