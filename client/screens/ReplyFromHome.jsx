import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;

export default function ReplyFromHome() {
  const [replyContent, setReplyContent] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  const { letterId, letterSenderId } = route.params || {};

  const handleReply = async () => {
    try {
      const senderId = await AsyncStorage.getItem("userId");

      if (!senderId) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "User ID not found",
          visibilityTime: 2000,
        });
        return;
      }

      if (!replyContent.trim()) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Reply cannot be empty",
          visibilityTime: 2000,
        });
        return;
      }

      if (!letterId || !letterSenderId) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "No item selected or missing required IDs",
          visibilityTime: 2000,
        });
        return;
      }

      const payload = {
        senderId: senderId,
        content: replyContent,
        letterId: letterId,
        reciverId: letterSenderId,
        hidden: true,
      };

      const response = await fetch("http://192.168.100.175:8080/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "Success",
          text2: "Reply sent successfully",
          visibilityTime: 500,
        });

        // Navigate to Home after 1 second delay
        setTimeout(() => {
          setReplyContent("");
          navigation.navigate("Home");
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: `Error: ${result.error || result.message}`,
          visibilityTime: 2000,
        });
        console.error("Backend Error:", result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: `Failed to send reply: ${error.message}`,
        visibilityTime: 2000,
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
            placeholderTextColor="#000"
            cursorColor="#000"
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
  textInput: {
    fontFamily: "Outfit_Regular",
    fontSize: 18,
    paddingRight: 20,
    width: "100%",
    textAlign: "justify",
    marginBottom: responsiveHeight(20),
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
