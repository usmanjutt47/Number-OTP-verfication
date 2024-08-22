import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Import axios

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

  const handleFavoriteClick = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }

      const data = {
        userId,
        letterId: letter._id, // Use letter._id instead of selectedItem._id
      };

      console.log("Sending request with data:", data);

      const response = await axios.post(
        "http://192.168.100.140:8080/api/v1/auth/addToFavorite",
        data
      );

      if (response.data.success) {
        if (isFavorite) {
          Alert.alert("Info", "This letter is already in your favorites.");
        } else {
          setIsFavorite(true);
          Alert.alert("Success", "Letter added to favorites!");
        }
      } else {
        Alert.alert(
          "Error",
          "Failed to add letter to favorites. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Error occurred while adding to favorites: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleReply = () => {
    navigation.navigate("ReplyFromHome", {
      letterId: letter._id, // Pass letter ID
      letterContent: letter.content, // Pass letter content if needed
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
            onPress={handleFavoriteClick}
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
        <Text style={{ fontSize: 18, marginBottom: 20 }}>{letter.content}</Text>

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
