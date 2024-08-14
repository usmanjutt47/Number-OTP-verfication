import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function CustomTopNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeScreen = route.name; 

  const handlePress = (screen) => {
    navigation.navigate(screen); 
  };

  return (
    <View style={styles.container}>
      <Pressable style={[styles.logo]} onPress={() => handlePress("Home")}>
        <Text style={{ color: "white" }}>Logo</Text>
      </Pressable>

      <Pressable
        style={[
          styles.favorite,
          activeScreen === "Favorite" && styles.activeButton, 
        ]}
        onPress={() => handlePress("Favorite")}
      >
        <AntDesign name="staro" size={24} color="black" />
      </Pressable>

      <Pressable
        style={[
          styles.allChats,
          activeScreen === "AllChats" && styles.activeButton,
        ]}
        onPress={() => handlePress("AllChats")}
      >
        <AntDesign name="inbox" size={24} color="black" />
      </Pressable>

      <Pressable
        style={[
          styles.sent,
          activeScreen === "Profile" && styles.activeButton, 
        ]}
        onPress={() => handlePress("Profile")}
      >
        <Feather name="send" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    width: 53,
    height: 53,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
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
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
});
