import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import CustomTopNav from "../components/CustomTopNav";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveIconSize = (size) => (size * width) / 375;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsivePadding = (size) => (size * width) / 375;

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
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  navContainer: {
    // width: "96%",
    alignSelf: "center",
    marginTop: responsiveHeight(20),
  },
  text: {
    fontSize: 38, // Adjust this size based on design requirements
    textAlign: "center", // Center the text
    marginTop: 20, // Added for some space below the top nav
  },
});
