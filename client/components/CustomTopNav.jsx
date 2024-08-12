import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function CustomTopNav() {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.logo}
        onPress={() => navigation.navigate("Home")} // Navigate to Home screen
      >
        <Text style={{ color: "white" }}>Logo</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.favorite,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
        onPress={() => navigation.navigate("Favorite")} // Navigate to Favorite screen
      >
        <AntDesign name="staro" size={24} color="black" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.allChats,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
        onPress={() => navigation.navigate("AllChats")} // Navigate to AllChats screen
      >
        <AntDesign name="inbox" size={24} color="black" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.sent,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
        onPress={() => navigation.navigate("Profile")} // Navigate to Profile screen
      >
        <Feather name="send" size={24} color="black" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.dropDown,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
      >
        <AntDesign name="down" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 53,
    height: 53,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  favorite: {
    padding: 10,
    borderRadius: 30,
  },
  allChats: {
    padding: 10,
    borderRadius: 30,
  },
  sent: {
    padding: 10,
    borderRadius: 30,
  },
  dropDown: {
    padding: 10,
    borderRadius: 30,
  },
});
