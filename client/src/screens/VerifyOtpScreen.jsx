import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";

const VerifyOtpScreen = ({ route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://192.168.10.4:8080/api/verify-otp",
        {
          phoneNumber,
          otp,
        }
      );
      console.log("OTP verification response:", response.data); // Log successful response
      Toast.show({ type: "success", text1: "OTP verified successfully" });
    } catch (error) {
      console.error("OTP verification error:", error); // Log error
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post(
        "http://192.168.10.4:8080/api/send-otp",
        {
          phoneNumber,
        }
      );
      console.log("OTP resend response:", response.data); // Log successful response
      Toast.show({ type: "success", text1: "OTP resent successfully" });
    } catch (error) {
      console.error("OTP resend error:", error); // Log error
      Toast.show({
        type: "error",
        text1: "Failed to resend OTP",
        text2: error.response ? error.response.data.message : error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter the OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify OTP" onPress={verifyOtp} />
      <Button title="Resend OTP" onPress={resendOtp} color="orange" />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default VerifyOtpScreen;
