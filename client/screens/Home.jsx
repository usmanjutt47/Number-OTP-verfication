import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CustomTopNav from "../components/CustomTopNav";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View>
        <CustomTopNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "red",
    padding: "5%",
  },
});
