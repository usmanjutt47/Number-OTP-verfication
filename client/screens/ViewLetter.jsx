import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsivePadding = (size) => (size * width) / 375;
const responsiveMargin = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;

export default function ViewLetter() {
  const route = useRoute();
  const { content, title, isFavorite: initialFavorite } = route.params;
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleReply = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        ToastAndroid.show("User ID not found", ToastAndroid.SHORT);
        return;
      }

      if (!replyContent.trim()) {
        ToastAndroid.show("Content cannot be empty", ToastAndroid.SHORT);
        return;
      }

      if (!selectedItem || !selectedItem._id) {
        ToastAndroid.show("No item selected", ToastAndroid.SHORT);
        return;
      }

      const response = await fetch(
        "http://192.168.10.3:8080/api/v1/auth/reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            content: replyContent,
            letterId: selectedItem._id,
          }),
        }
      );

      const rawResponse = await response.text();
      const result = JSON.parse(rawResponse);

      if (response.ok) {
        ToastAndroid.show("Reply sent successfully", ToastAndroid.SHORT);
        setReplyContent("");
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === selectedItem._id
              ? { ...letter, replied: true }
              : letter
          )
        );
        bottomSheetRef.current?.close();
      } else {
        ToastAndroid.show(`Error: ${result.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(
        `Failed to send reply: ${error.message}`,
        ToastAndroid.SHORT
      );
      console.log(`Failed to send reply: ${error.message}`);
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#BCBABA", justifyContent: "center" }}
    >
      <View
        style={{
          width: "100%",
          height: "90%",
          paddingLeft: "5%",
          backgroundColor: "#ffffff",
          borderRadius: 23,
          padding: responsivePadding(20),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 24, fontFamily: "Inter_Bold" }}>
            Anonymous
          </Text>
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              height: responsiveHeight(53),
              width: responsiveWidth(53),
              backgroundColor: "#FFF8E4",
              justifyContent: "center",
              borderRadius: 50,
            }}
            onPress={toggleFavorite}
          >
            {isFavorite ? (
              <AntDesign
                name="star"
                size={24}
                color="gold"
                style={{ alignSelf: "center" }}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color="gray"
                style={{ alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>{content}</Text>

        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Text style={styles.replyButtonText}>Reply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  replyButton: {
    height: 62,
    width: "100%",
    backgroundColor: "#075856",
    justifyContent: "center",
    borderRadius: 44,
    marginTop: responsiveHeight(100),
    position: "absolute",
    bottom: responsiveHeight(20),
    alignSelf: "center",
  },
  replyButtonText: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Outfit_Medium",
    textAlign: "center",
    color: "#fff",
  },
});
