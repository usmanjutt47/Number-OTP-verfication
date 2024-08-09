import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import React, { useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import CustomTopNav from "../components/CustomTopNav";

export default function Profile() {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2, // Increase size
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1, // Original size
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scaleAnimation.start();

    return () => scaleAnimation.stop(); // Stop the animation on unmount
  }, [scaleValue]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={{ marginTop: "10%" }}>
          <CustomTopNav />
        </View>
        <View style={styles.imageWrapper}>
          <Animated.View
            style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/icons/NoPost.png")}
              style={styles.image}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: "90%",
    height: "100%",
    alignSelf: "center",
    // backgroundColor: "lightblue",
  },
  imageWrapper: {
    marginTop: "45%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#E9E9E9", // Adjust the color and opacity as needed
  },
  imageContainer: {
    width: 146.1,
    height: 146.1,
    backgroundColor: "#E3E3E3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
  },
  image: {
    width: 56.07,
    height: 56.46,
    borderRadius: 100, // Makes the image round
  },
});
