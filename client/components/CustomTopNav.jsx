import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function CustomTopNav() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.logo}>
        <Text>Logo</Text>
      </Pressable>

      <Pressable style={styles.star}>
        <Text>Star</Text>
      </Pressable>

      <Pressable style={styles.feed}>
        <Text>Feed</Text>
      </Pressable>

      <Pressable style={styles.updates}>
        <Text>Updates</Text>
      </Pressable>

      <Pressable style={styles.dropDown}>
        <Text>Drop Down</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "blue",
    justifyContent: "space-between",
    padding: 10,
  },
  logo: {
    // Add any styles for the logo here
  },
  star: {
    // Add any styles for the star here
  },
  feed: {
    // Add any styles for the feed here
  },
  updates: {
    // Add any styles for the updates here
  },
  dropDown: {
    // Add any styles for the dropDown here
  },
});
