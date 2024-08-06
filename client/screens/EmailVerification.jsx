import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

export default function EmailVerification() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handelSendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.100.175:8080/api/v1/auth/send-otp",
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
          navigation.navigate("OTPVerification", { email: email });
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
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>

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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handelSendOTP}
          style={styles.sendButton}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send Now</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: height * 0.06,
  },
  backButton: {
    height: 52,
    width: 52,
    backgroundColor: "#d9d9d9",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },
  backArrowContainer: {
    position: "absolute",
    top: width * 0.08,
    left: width * 0.02,
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F1",
    borderRadius: width * 0.05,
  },
  logo: {
    fontFamily: "Kanit_Bold",
    fontSize: width * 0.12,
    marginBottom: height * 0.03,
    alignSelf: "center",
  },
  emailLable: {
    fontFamily: "Outfit_Medium",
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
    marginLeft: width * 0.03,
    alignSelf: "flex-start",
  },
  emailInputContainer: {
    position: "relative",
    height: height * 0.08,
    marginBottom: height * 0.03,
  },
  mailIcon: {
    position: "absolute",
    left: width * 0.04,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  emailInput: {
    width: "100%",
    height: "100%",
    borderColor: "#6c6c6c",
    borderWidth: 1,
    borderRadius: width * 0.09,
    paddingLeft: width * 0.12,
    paddingRight: width * 0.05,
    backgroundColor: "#fff",
    zIndex: 0,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
  },
  sendButton: {
    backgroundColor: "#075856",
    height: height * 0.07,
    width: "100%",
    justifyContent: "center",
    borderRadius: width * 0.1,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    textAlign: "center",
    fontFamily: "Outfit_Medium",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
