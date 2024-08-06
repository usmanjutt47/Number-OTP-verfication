import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

export default function OTPVerification({ navigation }) {
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const route = useRoute();
  const email = route.params?.email || "";

  useEffect(() => {
    // Update OTP from input values whenever they change
    setOtp(inputValues.join(""));
  }, [inputValues]);

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

  const formatEmail = (email) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    if (!localPart || !domainPart) return "";
    const start = localPart.slice(0, 2);
    const end = localPart.slice(-2);
    const masked = "*".repeat(localPart.length - 4);
    return `${start}${masked}${end}@${domainPart}`;
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "OTP is required.",
      });
      return;
    }

    const email = route.params?.email || "";
    console.log("Sending OTP:", otp);

    try {
      const response = await axios.post(
        "http://192.168.100.175:8080/api/v1/auth/verify-otp",
        { email, otp }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP verified successfully.",
        });

        setTimeout(() => {
          navigation.navigate("Home");
        }, 100);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while verifying OTP.",
      });
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
            color="black"
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleOtpVerification} style={styles.button}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.03,
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
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    fontSize: width * 0.1,
    textAlign: "center",
    width: width * 0.2,
    height: height * 0.1,
    fontFamily: "Outfit_Regular",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
    position: "absolute",
    bottom: height * 0.01,
  },
  button: {
    backgroundColor: "#075856",
    height: height * 0.07,
    width: width * 0.9,
    justifyContent: "center",
    borderRadius: 24,
    bottom: height * 0.01,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    textAlign: "center",
    fontFamily: "Outfit_Medium",
  },
});
