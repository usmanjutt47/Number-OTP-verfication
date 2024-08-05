import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function OTPVerification() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={handleNavigate} style={styles.backArrowContainer}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color="black"
              style={{ alignSelf: "center" }}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "Sf_Pro_Display_Bold",
              paddingLeft: "3%",
              fontSize: 20,
              letterSpacing: 1,
            }}
          >
            Enter Otp
          </Text>
        </View>
        <View style={{ alignItems: "center", marginTop: "30%" }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "Outfit_Medium",
              color: "#2b2b2b",
            }}
          >
            Enter Your OTP
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Outfit_Regular",
              color: "#555555",
            }}
          >
            Code has been sent to fahadayyaz31@gmail.com
          </Text>
          <View style={styles.otpBoxesContainer}></View>
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
    flex: 1,
    width: "90%",
    backgroundColor: "lightblue",
    alignSelf: "center",
  },
  headerContainer: {
    flexDirection: "row",
    height: "7%",
    width: "100%",
    alignItems: "center",
    marginTop: "10%",
  },
  backArrowContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F1",
    borderRadius: 26,
  },
});
