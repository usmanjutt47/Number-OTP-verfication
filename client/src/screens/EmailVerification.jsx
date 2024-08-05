import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import CustomSlider from "../../components/CustomSlider";
import { useNavigation } from "@react-navigation/native";

export default function EmailVerification() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.goBack();
  };
  const handleSwipe = () => {
    navigation.navigate("OTPVerification");
  };
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        {/* header starts here */}
        <Pressable onPress={handleNavigate} style={styles.backArrowContainer}>
          <Ionicons
            name="chevron-back-sharp"
            size={24}
            color="black"
            style={{ alignSelf: "center" }}
          />
        </Pressable>

        <Text style={styles.logo}>Logo</Text>

        <Text style={styles.emailLable}>Enter Email</Text>
        <View style={styles.emailInputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="black"
            style={styles.mailIcon}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            placeholderTextColor={"#434343"}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.sliderContainer}>
          <CustomSlider onSwipe={handleSwipe} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },

  backArrowContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F1",
    borderRadius: 26,
    marginTop: "10%",
  },
  logo: {
    fontFamily: "Kanit_Bold",
    fontSize: 48,
    alignSelf: "center",
    marginTop: "30%",
  },
  emailLable: {
    marginTop: "30%",
    marginBottom: "2%",
    fontFamily: "Outfit_Medium",
    fontSize: 18,
  },
  emailInputContainer: {
    position: "relative",
    height: 58,
    justifyContent: "center",
  },
  mailIcon: {
    position: "absolute",
    left: 15,
    top: 15,
    zIndex: 1, // Ensures the icon is above the TextInput
  },
  emailInput: {
    width: "100%",
    height: 58,
    borderColor: "#6c6c6c",
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 50, // Ensure there's enough padding for the icon
    backgroundColor: "#fff",
    zIndex: 0, // Ensures the TextInput is below the icon
  },
  sliderContainer: {
    marginTop: "75%",
    alignSelf: "center",
  },
});
