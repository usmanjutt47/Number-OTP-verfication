import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import CustoomKeyboard from "../../components/CustoomKeyboard";

const NumberVerification = () => {
  const [inputValue, setInputValue] = useState("");
  const intervalRef = useRef(null);

  const handleNumberPress = (number) => {
    setInputValue((prevValue) => prevValue + number);
  };

  const handleIconPress = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const startRemoving = () => {
    intervalRef.current = setInterval(handleIconPress, 10);
  };

  const stopRemoving = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backButton}>
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        </View>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Logo</Text>
        </View>
        <View style={styles.phoneInputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            editable={false}
            showSoftInputOnFocus={false}
            placeholder="Click the numbers"
          />
        </View>
        <View style={styles.keyBoardContainer}>
          <CustoomKeyboard />
        </View>
        <View style={styles.customSliderContainer}></View>
      </View>
    </View>
  );
};

export default NumberVerification;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: "90%",
    height: "100%",
    alignSelf: "center",
  },
  headerContainer: {
    marginTop: 30,
  },
  backButton: {
    width: 52.21,
    height: 52.21,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CBCBCB",
  },
  logoContainer: {
    alignSelf: "center",
  },
  logo: {
    fontFamily: "Kanit_Bold",
    fontSize: 36,
  },
  phoneInputContainer: {},
  input: {
    width: "100%",
    height: 10,
    borderWidth: 1,
  },
  keyBoardContainer: {
    marginTop: "40%",
    width: "100%",
    height: "35%",
  },
  customSliderContainer: {},
});
