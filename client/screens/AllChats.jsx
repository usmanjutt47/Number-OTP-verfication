import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import CustomTopNav from "../components/CustomTopNav";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const responsiveSize = (size, dimension = "width") => {
  const factor = dimension === "width" ? width : height;
  return (size * factor) / 375;
};

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
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Added a background color for better visibility
  },
  navContainer: {
    width: "96%", // Ensuring the nav container has some margin from the edges
    marginTop: responsiveSize(20, "height"),
  },
  text: {
    fontSize: responsiveSize(38),
    textAlign: "center",
    marginTop: responsiveSize(20, "height"), // Consistent spacing below the nav
  },
});
