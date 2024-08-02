import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import CustomKeyboard from "../../components/CustomKeyboard";
import CustomSlider from "../../components/CustomSlider";

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
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              /* Add your navigation logic here */
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
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
            placeholder="0092 000 000 000 000"
            placeholderTextColor="gray"
            // No need for textColor as we set the color directly in the style
          />
        </View>
        <View style={styles.keyBoardContainer}>
          <CustomKeyboard
            onNumberPress={handleNumberPress}
            onIconPress={handleIconPress}
            startRemoving={startRemoving}
            stopRemoving={stopRemoving}
          />
        </View>
        <View style={styles.customSliderContainer}>
          <CustomSlider />
        </View>
      </View>
    </SafeAreaView>
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
    marginTop: 20,
    paddingLeft: 10,
  },
  logoContainer: {
    alignSelf: "center",
    marginTop: "15%",
  },
  logo: {
    fontFamily: "Kanit_Bold",
    fontSize: 36,
  },
  phoneInputContainer: {
    marginTop: "40%",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
    paddingLeft: 20,
    color: "black", // Set the text color to red
  },
  keyBoardContainer: {
    marginTop: "15%",
    width: "100%",
    height: "30%",
    marginBottom: "5%",
  },
  customSliderContainer: {},
});
