import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function EmailVerification() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handelSendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.100.6:8080/api/v1/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP sent successfully. Please check your email.",
          visibilityTime: 500,
        });
        setEmail("");
        setTimeout(() => {
          navigation.navigate("OTPVerification");
        }, 500);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "Failed to send OTP.",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while sending OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        {/* header starts here */}
        <Pressable style={styles.backArrowContainer}>
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
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.sliderContainer}>
          <TouchableOpacity
            onPress={handelSendOTP}
            style={{
              backgroundColor: "#075856",
              height: 48,
              width: "100%",
              justifyContent: "center",
              borderRadius: 49,
            }}
            disabled={loading}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                textAlign: "center",
                fontFamily: "Outfit_Medium",
              }}
            >
              Send Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#075856"
            style={{ marginTop: "25%" }}
          />
        </View>
      )}
      <Toast />
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
    zIndex: 1,
  },
  emailInput: {
    width: "100%",
    height: 58,
    borderColor: "#6c6c6c",
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 50,
    backgroundColor: "#fff",
    zIndex: 0,
  },
  sliderContainer: {
    alignItems: "center",
    marginTop: "90%",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
