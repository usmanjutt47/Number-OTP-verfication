import React, { useState } from "react";
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

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;

export default function ReplyFromHome() {
  const [replyContent, setReplyContent] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const [letters, setLetters] = useState([]);

  const { letterId } = route.params || {};

  const handleReply = async () => {
    try {
      const senderId = await AsyncStorage.getItem("userId");

      console.log("Sender ID:", senderId);
      console.log("Reply Content:", replyContent);
      console.log("Letter ID:", letterId);

      if (!senderId) {
        Alert.alert("Error", "User ID not found");
        return;
      }

      if (!replyContent.trim()) {
        Alert.alert("Error", "Content cannot be empty");
        return;
      }

      if (!letterId) {
        Alert.alert("Error", "No letter selected");
        return;
      }

      const receiverId = route.params?.receiverId || null; // Fetch receiverId from route params

      console.log("Receiver ID:", receiverId);

      if (!receiverId) {
        Alert.alert("Error", "Receiver ID not found");
        return;
      }

      const response = await fetch("http://192.168.100.6:8080/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          content: replyContent,
          letterId: letterId,
          receiverId: receiverId, // Make sure this is sent
        }),
      });

      const result = await response.json();

      console.log("Response Status:", response.status);
      console.log("API Response:", result);

      if (response.ok) {
        Alert.alert("Success", "Reply sent successfully");
        setReplyContent("");
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", `Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      Alert.alert("Error", `Failed to send reply: ${error.message}`);
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
  header: {
    height: responsiveHeight(50),
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(24),
    color: "#000",
    marginLeft: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  letterContent: {
    fontSize: responsiveFontSize(18),
    marginBottom: responsiveHeight(10),
    color: "#000",
  },
  textInput: {
    fontFamily: "Outfit_Regular",
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
    bottom: responsiveHeight(10),
  },
  sendButtonText: {
    textAlign: "center",
    fontSize: responsiveFontSize(18),
    color: "#fff",
  },
});
