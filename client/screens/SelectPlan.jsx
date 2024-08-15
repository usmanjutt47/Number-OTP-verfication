import { View, Text, StyleSheet } from "react-native";
import React from "react";

const SelectPlan = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Plan</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default SelectPlan;
