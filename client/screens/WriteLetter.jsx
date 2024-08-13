import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function WriteLetter() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name="email-edit-outline"
            size={28}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.heading}>Write Letter</Text>
        </View>
        {/* Text input with multiline support */}
        <TextInput
          style={styles.textInput}
          placeholder="Type here . . ."
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
        />
        <Pressable style={styles.sendButton}>
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              fontFamily: "Outfit_Medium",
            }}
          >
            Send Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#BCBABA",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    height: "90%",
    paddingLeft: "5%",
    backgroundColor: "#ffffff",
    borderRadius: 23,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: "5%",
    alignItems: "center",
  },
  icon: {},
  heading: {
    fontFamily: "Inter_Bold",
    marginLeft: "5%",
    fontSize: 24,
    fontWeight: "bold",
  },
  textInput: {
    marginTop: "5%",
    fontSize: 18,
    fontFamily: "Outfit_Regular",
    paddingHorizontal: 10,
    paddingRight: 20,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "#075856",
    width: "80%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "5%",
  },
});
