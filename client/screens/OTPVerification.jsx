import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

export default function OTPVerification({ navigation }) {
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const route = useRoute();
  const email = route.params?.email || "";
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startTimer = () => {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsResendEnabled(true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    };

    startTimer(); // Start the timer initially
    timerRef.current = startTimer; // Store the function to be called later

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    setOtp(inputValues.join(""));
  }, [inputValues]);

  const formatEmail = (email) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    if (!localPart || !domainPart) return "";
    const start = localPart.slice(0, 2);
    const end = localPart.slice(-2);
    const masked = "*".repeat(localPart.length - 1);
    return `${start}${masked}${end}@${domainPart}`;
  };

  const handleTextChange = (text, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = text;

    setInputValues(newInputValues);

    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleIconPress = () => {
    const lastNonEmptyIndex = inputValues
      .slice()
      .reverse()
      .findIndex((value) => value !== "");

    const indexToRemove = inputValues.length - 1 - lastNonEmptyIndex;

    if (lastNonEmptyIndex !== -1) {
      setInputValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[indexToRemove] = "";
        return newValues;
      });

      if (indexToRemove > 0) {
        inputRefs.current[indexToRemove - 1].focus();
      }
    }
  };

  const handleLongPress = () => {
    timerRef.current = setInterval(handleIconPress, 50);
  };

  const handlePressOut = () => {
    clearInterval(timerRef.current);
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: "Please enter the OTP sent to your email.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.100.175:8080/api/user/verify",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        const { userId, message } = response.data;

        if (userId) {
          // Store user ID in AsyncStorage
          await AsyncStorage.setItem("userId", userId);
          console.log("_id", userId);

          Toast.show({
            type: "success",
            text1: "Success",
            text2: message, // Use the message from the response
          });

          navigation.navigate("Home");
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "User ID not received from the server.",
          });
        }
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

  const handleSubmit = async () => {
    setLoading(true);
    setCountdown(60); // Reset countdown to 60 seconds
    setIsResendEnabled(false);
    timerRef.current(); // Start the timer again
    try {
      const response = await axios.post(
        "http://192.168.100.175:8080/api/user/",
        {
          email,
        }
      );

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP sent to your email address.",
        });
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#1E1E1E"
            style={styles.icon}
          />
        </Pressable>
        <Text style={styles.headerText}>Enter OTP</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Your OTP</Text>
        <Text style={styles.subtitle}>
          Code has been sent to {formatEmail(email)}
        </Text>
      </View>
      <View style={styles.inputsContainer}>
        {inputValues.map((value, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={value}
            ref={(ref) => (inputRefs.current[index] = ref)}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleTextChange(text, index)}
          />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#075856" />
      ) : (
        <>
          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <>
                <Text>Resend code in </Text>
                <Text style={styles.countdownText}>{countdown}</Text>
                <Text>s</Text>
              </>
            ) : (
              <Pressable onPress={handleSubmit}>
                <Text style={styles.resendText}>Resend Code</Text>
              </Pressable>
            )}
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleOtpSubmit}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </Pressable>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#f3f3f3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  backButton: {
    height: 43,
    width: 43,
    backgroundColor: "#fff",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    alignSelf: "center",
  },
  headerText: {
    fontFamily: "Sf_Pro_Display_Bold",
    fontSize: width * 0.05,
    paddingLeft: width * 0.03,
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  title: {
    fontFamily: "Outfit_Medium",
    fontSize: width * 0.08,
    textAlign: "center",
  },
  subtitle: {
    color: "#555555",
    textAlign: "center",
    marginTop: height * 0.01,
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: height * 0.05,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 19,
    fontSize: width * 0.1,
    textAlign: "center",
    width: width * 0.2,
    height: height * 0.1,
    fontFamily: "Outfit_Regular",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: height * 0.06,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#075856",
    height: height * 0.07,
    width: width * 0.9,
    justifyContent: "center",
    borderRadius: 44,
    bottom: height * 0.01,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    textAlign: "center",
    fontFamily: "Outfit_Medium",
  },
  resendContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  countdownText: {
    color: "#075856",
  },
  resendText: {
    color: "#075856",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
