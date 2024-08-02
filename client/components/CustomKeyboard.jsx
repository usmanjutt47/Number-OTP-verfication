import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

export default function CustomKeyboard({
  onNumberPress,
  onIconPress,
  startRemoving,
  stopRemoving,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          {[1, 2, 3, 4].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => onNumberPress(number.toString())}
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
              onPress={() => onNumberPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[9, 0, "+"].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => onNumberPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
          <Pressable
            style={styles.iconButton}
            onPress={onIconPress}
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
