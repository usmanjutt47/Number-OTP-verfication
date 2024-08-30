import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "@env";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsivePadding = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;

export default function ViewLetter() {
  const route = useRoute();
  const navigation = useNavigation();
  const { letter } = route.params;
  const [isFavorite, setIsFavorite] = useState(letter.isFavorite);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const status = await AsyncStorage.getItem(`favorite-${letter._id}`);
        if (status !== null) {
          setIsFavorite(status === "true");
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [letter._id]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(
        `${SERVER_URL}/letter/toggle-favorite/${letter._id}`,
        {
          userId,
        }
      );

      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      await AsyncStorage.setItem(
        `favorite-${letter._id}`,
        newFavoriteStatus ? "true" : "false"
      );

      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: newFavoriteStatus
            ? "Added to Favorites"
            : "Removed from Favorites",
        });
      }, 500);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    if (!letter) {
      console.error("Letter object is undefined");
      return;
    }

    const { _id, senderId } = letter;
    console.log("Letter ID:", _id);
    console.log("Sender ID:", senderId);

    navigation.navigate("ReplyFromHome", {
      letterId: _id,
      letterSenderId: senderId,
    });
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
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="gray" /> // Show loader
            ) : isFavorite ? (
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
        <Text style={{ fontSize: 18, marginBottom: 20 }}>{letter.content}</Text>

        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Text style={styles.replyButtonText}>Reply Now</Text>
        </TouchableOpacity>
      </View>
      <Toast />
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
