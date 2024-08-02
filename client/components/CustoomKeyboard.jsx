import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

export default function CustomKeyboard() {
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
    <View style={styles.container}>
      {/* <Text>Keyboard</Text> */}
      {/* <TextInput
        style={styles.input}
        value={inputValue}
        editable={false}
        showSoftInputOnFocus={false}
        placeholder="Click the numbers"
      /> */}
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNumberPress(".")}
          >
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNumberPress("9")}
          >
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNumberPress("0")}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <Pressable
            style={styles.iconButton}
            onPress={handleIconPress}
            onLongPress={startRemoving}
            onPressOut={stopRemoving}
          >
            <Image
              source={require("../assets/icons/cross.png")}
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    width: "100%",
    marginBottom: 16,
  },
  buttonsContainer: {
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  button: {
    margin: 4,
    borderRadius: 50,
    width: 82,
    height: 82,
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
    margin: 4,
    borderRadius: 50,
    width: 82,
    height: 82,
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
