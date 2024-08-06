import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";

const SendOtpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        "http://192.168.10.4:8080/api/send-otp",
        {
          phoneNumber,
        }
      );
      Toast.show({ type: "success", text1: "OTP sent successfully" });
      navigation.navigate("VerifyOtp", { phoneNumber });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to send OTP" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Send OTP" onPress={sendOtp} />
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
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default SendOtpScreen;
