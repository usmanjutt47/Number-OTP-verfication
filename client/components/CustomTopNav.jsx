import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function CustomTopNav() {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route
  const [activeButton, setActiveButton] = useState(route.name); // Initialize with current route

  useEffect(() => {
    // Update the active button when the route changes
    setActiveButton(route.name);
  }, [route.name]);

  const handlePress = (buttonName, screen) => {
    setActiveButton(buttonName);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.logo,
            activeButton === "Home" && styles.inactiveButton, // Home should not be green
          ]}
          onPress={() => handlePress("Home", "Home")}
        >
          <Text style={styles.logoText}>Logo</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.favorite,
            activeButton === "Favorite" && styles.activeButton, // Favorite should be green when active
          ]}
          onPress={() => handlePress("Favorite", "Favorite")}
        >
          <AntDesign
            name="staro"
            size={24}
            color={activeButton === "Favorite" ? "green" : "black"}
          />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.allChats,
            activeButton === "AllChats" && styles.activeButton, // AllChats should be green when active
          ]}
          onPress={() => handlePress("AllChats", "AllChats")}
        >
          <AntDesign
            name="inbox"
            size={24}
            color={activeButton === "AllChats" ? "green" : "black"}
          />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.sent,
            activeButton === "Profile" && styles.activeButton,
          ]}
          onPress={() => handlePress("Profile", "Profile")}
        >
          <Feather name="send" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.dropDown,
            activeButton === "DropDown" && styles.activeButton,
          ]}
          onPress={() => setActiveButton("DropDown")}
        >
          <AntDesign name="down" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 53,
    height: 53,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
  },
  favorite: {
    padding: 10,
    borderRadius: 30,
  },
  allChats: {
    padding: 10,
    borderRadius: 30,
  },
  sent: {
    padding: 10,
    borderRadius: 30,
  },
  dropDown: {
    padding: 10,
    borderRadius: 30,
  },
  activeButton: {
    backgroundColor: "green",
  },
  inactiveButton: {
    backgroundColor: "black", // Ensure Home stays black
  },
});
