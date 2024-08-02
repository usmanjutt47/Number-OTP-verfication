import { View, StyleSheet, Text, Pressable } from "react-native";
import React from "react";

const NumberVerification = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable></Pressable>
      </View>
      <View style={styles.logoContainer}></View>
      <View style={styles.phoneInputContainer}></View>
      <View style={styles.keyBoardContainer}></View>
      <View style={styles.customSliderContainer}></View>

      <Text>NumberVerification</Text>
    </View>
  );
};

export default NumberVerification;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "lightblue",
  },
  headerContainer: {},
  logoContainer: {},
  phoneInputContainer: {},
  keyBoardContainer: {},
  customSliderContainer: {},
});
