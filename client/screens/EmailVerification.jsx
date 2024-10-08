import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { SERVER_URL } from "@env";

const { height, width } = Dimensions.get("window");

export default function EmailVerification() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !isValidEmail(email)) {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${SERVER_URL}/user/`, {
        email,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP sent to your email address.",
        });
        navigation.navigate("OTPVerification", { email });
        setEmail("");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.response?.data?.error || "Internal server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>Logo</Text>

        <Text style={styles.emailLable}>Enter Email</Text>
        <View style={styles.emailInputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#040404"
            style={styles.mailIcon}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="example@gmail.com"
            placeholderTextColor={"gray"}
            keyboardType="email-address"
            cursorColor={"#040404"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.sendButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send Now</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075856" />
        </View>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: height * 0.06,
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
  logo: {
    fontSize: width * 0.12,
    marginBottom: height * 0.03,
    alignSelf: "center",
  },
  emailLable: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    marginLeft: width * 0.03,
    alignSelf: "flex-start",
    fontFamily: "Outfit_Medium",
    color: "#040404",
  },
  emailInputContainer: {
    position: "relative",
    height: height * 0.07,
    marginBottom: height * 0.03,
  },
  mailIcon: {
    position: "absolute",
    left: width * 0.04,
    top: "45%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  emailInput: {
    width: "100%",
    height: "90%",
    borderColor: "#6C6C6C",
    borderWidth: 1,
    borderRadius: width * 0.09,
    paddingLeft: width * 0.12,
    paddingRight: width * 0.05,
    backgroundColor: "#f3f3f3",
    zIndex: 0,
    fontFamily: "Outfit_Regular",
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
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
