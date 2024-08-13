import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CustomTopNav from "../components/CustomTopNav";
import { StatusBar } from "expo-status-bar";

export default function AllChats() {
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />

      <View style={styles.navContainer}>
        <CustomTopNav />
      </View>
      <Text style={styles.text}>All Chats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16, // Added for padding on the sides
  },
  navContainer: {
    marginTop: "10%",
  },
  text: {
    fontSize: 38, // Adjust this size based on design requirements
    textAlign: "center", // Center the text
    marginTop: 20, // Added for some space below the top nav
  },
});