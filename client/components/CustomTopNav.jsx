import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function CustomTopNav() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.logo}>
        <Text style={{ color: "white" }}>Logo</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.star,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
      >
        <AntDesign name="staro" size={24} color="black" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.inbox,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
      >
        <AntDesign name="inbox" size={24} color="black" />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.sent,
          pressed && { backgroundColor: "rgba(137, 137, 137, 0.38)" },
        ]}
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
    marginTop: "10%",
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
  star: {
    padding: 10,
    borderRadius: 30,
  },
  inbox: {
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
