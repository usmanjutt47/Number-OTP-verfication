import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import CustomSlider from "../../components/CustomSlider";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OTPVerification() {
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const handleNumberPress = (number) => {
    const firstEmptyIndex = inputValues.findIndex((value) => value === "");

    if (firstEmptyIndex !== -1) {
      setInputValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[firstEmptyIndex] = number;
        return newValues;
      });

      if (firstEmptyIndex < inputRefs.current.length - 1) {
        inputRefs.current[firstEmptyIndex + 1].focus();
      }
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

  return (
    <View style={styles.container}>
      <View
        style={{
          height: "6%",
          width: "100%",
          flexDirection: "row",
          marginTop: "5%",
        }}
      >
        <Pressable
          style={{
            height: 52,
            width: 52,
            backgroundColor: "#d9d9d9",
            borderRadius: 30,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            style={{ alignSelf: "center" }}
          />
        </Pressable>
        <Text
          style={{
            fontFamily: "Sf_Pro_Display_Bold",
            fontSize: 20,
            paddingLeft: 10,
            alignSelf: "center",
          }}
        >
          Enter Otp
        </Text>
      </View>
      <View
        style={{
          alignSelf: "center",
          marginTop: "30%",
        }}
      >
        <Text
          style={{
            fontFamily: "Outfit_Medium",
            fontSize: 32,
            textAlign: "center",
          }}
        >
          EnterYour OTP
        </Text>
        <Text style={{ color: "#555555", textAlign: "center" }}>
          Code has sent to usmanjutt04747@gmail.com
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
            editable={false}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          {[1, 2, 3, 4].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => handleNumberPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[5, 6, 7, 8].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => handleNumberPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[".", 9, 0].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => handleNumberPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
          <Pressable
            style={styles.iconButton}
            onPress={handleIconPress}
            onLongPress={handleLongPress}
            onPressOut={handlePressOut}
          >
            <Image
              source={require("../../assets/icons/cross.png")}
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          alignSelf: "center",
          marginTop: "30%",
        }}
      >
        <CustomSlider />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: "5%",
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10%",
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 19,
    fontSize: 24,
    textAlign: "center",
    width: 77,
    height: 80,
    fontFamily: "Outfit_Regular",
  },
  buttonsContainer: {
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    marginTop: "20%",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 50,
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonText: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "Outfit_Regular",
  },
  iconButton: {
    borderRadius: 50,
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
});