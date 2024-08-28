import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WriteLetter() {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found in storage");
        }
      } catch (error) {
        console.error("Failed to load user ID:", error);
      }
    };

    getUserId();
  }, []);

  const sendLetter = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Content cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://192.168.100.175:8080/api/letter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          content,
        }),
      });

      const result = await response.json();

      if (response.status === 201) {
        Alert.alert("Success", "Letter sent successfully");
        setContent("");
        navigation.navigate("Home"); // Back to previous screen
      } else {
        Alert.alert("Error", result.error || "Failed to send letter");
      }
    } catch (error) {
      console.error("Error sending letter:", error);
      Alert.alert("Error", "An error occurred while sending the letter");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name="email-edit-outline"
            size={28}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.heading}>Write Letter</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Type here . . ."
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendLetter}>
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              fontFamily: "Outfit_Medium",
            }}
          >
            Send Now
          </Text>
        </TouchableOpacity>
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
  icon: {},
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
    width: "80%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "5%",
  },
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
  icon: {},
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
    width: "80%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "5%",
  },
});
