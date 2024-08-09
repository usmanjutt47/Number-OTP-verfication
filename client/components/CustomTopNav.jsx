import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function CustomTopNav() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.navContainer}>
        <View style={styles.logoContainer}></View>
        <View style={styles.starContainer}></View>
        <View style={styles.feedContainer}></View>
        <View style={styles.updatesContainer}></View>
        <View style={styles.dropDownContainer}></View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {},
  navContainer: {
    backgroundColor: "blue",
  },
  logoContainer: {},
  starContainer: {},
  feedContainer: {},
  updatesContainer: {},
  dropDownContainer: {},
});
