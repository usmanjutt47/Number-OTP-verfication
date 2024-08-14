import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
  return (size * width) / 375;
};

const responsiveIconSize = (size) => {
  return (size * width) / 375;
};

const responsiveWidth = (size) => {
  return (size * width) / 375;
};

const responsiveHeight = (size) => {
  return (size * height) / 812;
};

const responsivePadding = (size) => {
  return (size * width) / 375;
};

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
        <Text style={[styles.logoText]}>Logo</Text>
      </Pressable>

      <Pressable
        style={[
          styles.favorite,
          activeScreen === "Favorite" && styles.activeButton,
        ]}
        onPress={() => handlePress("Favorite")}
      >
        <AntDesign name="staro" size={responsiveIconSize(24)} color="black" />
      </Pressable>

      <Pressable
        style={[
          styles.allChats,
          activeScreen === "AllChats" && styles.activeButton,
        ]}
        onPress={() => handlePress("AllChats")}
      >
        <AntDesign name="inbox" size={responsiveIconSize(24)} color="black" />
      </Pressable>

      <Pressable
        style={[styles.sent, activeScreen === "Profile" && styles.activeButton]}
        onPress={() => handlePress("Profile")}
      >
        <Feather name="send" size={responsiveIconSize(24)} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: responsivePadding(10),
  },
  logo: {
    width: responsiveWidth(53),
    height: responsiveHeight(53),
    borderRadius: responsiveWidth(30),
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: responsiveFontSize(16),
  },
  favorite: {
    padding: responsivePadding(10),
    borderRadius: responsiveWidth(30),
  },
  allChats: {
    padding: responsivePadding(10),
    borderRadius: responsiveWidth(30),
  },
  sent: {
    padding: responsivePadding(10),
    borderRadius: responsiveWidth(30),
  },
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
});
