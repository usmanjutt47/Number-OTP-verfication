import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * height) / 812;
const responsiveMargin = (size) => (size * height) / 812;

const responsivePadding = (size) => {
  return (size * width) / 375;
};

export default function WriteLetter() {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found in storage");
        }
      } catch (error) {
        console.error("Failed to load user ID:", error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scaleAnimation.start();

    return () => scaleAnimation.stop();
  }, [scaleValue]);

  const sendLetter = async () => {
    if (!content.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Content cannot be empty",
      });
      return;
    }

    try {
      const response = await fetch("http://192.168.100.6:8080/api/letter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          content,
        }),
      });

      const result = await response.json();

      if (response.status === 201) {
        setModalVisible(true);
        setContent("");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.error || "Failed to send letter",
        });
      }
    } catch (error) {
      console.error("Error sending letter:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while sending the letter",
      });
    }
  };

  const SuccessModal = ({ visible, onClose }) => {
    if (!visible) return null;
    const navigation = useNavigation();
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.imageWrapper}>
            <Animated.View
              style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
            />
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/icons/profile.png")}
                style={{
                  height: responsiveHeight(23),
                  width: responsiveHeight(23),
                  tintColor: "#fff",
                }}
              />
            </View>
          </View>
          <Text style={styles.modalHeading}>Done!</Text>
          <Text style={styles.modalText}>Letter sent successfully!</Text>
          <View
            style={{
              alignItems: "center",
              width: "90%",
              position: "absolute",
              bottom: "5%",
            }}
          >
            <Pressable
              onPress={() => navigation.navigate("Home")}
              style={{
                width: "40%",
                backgroundColor: "#075856",
                height: responsiveHeight(48),
                justifyContent: "center",
                borderRadius: 44,
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(15),
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "Outfit_Bold",
                }}
              >
                Okay
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name="email-edit-outline"
            size={28}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.heading}>Write Letter</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Type here . . ."
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendLetter}>
          <Text style={styles.sendButtonText}>Send Now</Text>
        </TouchableOpacity>
      </View>

      <SuccessModal visible={modalVisible} onClose={closeModal} />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#BCBABA",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    height: "90%",
    paddingLeft: "5%",
    backgroundColor: "#ffffff",
    borderRadius: 23,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: "5%",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Inter_Bold",
    marginLeft: "5%",
    fontSize: 24,
    fontWeight: "bold",
  },
  textInput: {
    fontFamily: "Outfit_Regular",
    marginTop: "5%",
    fontSize: 18,
    paddingRight: 20,
    width: "70%",
    textAlign: "justify",
  },
  sendButton: {
    backgroundColor: "#075856",
    width: "80%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "5%",
  },
  sendButtonText: {
    color: "#fff",
    alignSelf: "center",
    fontFamily: "Outfit_Medium",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  modalContent: {
    width: "90%",
    height: responsiveHeight(250),
    backgroundColor: "#fff",
    borderRadius: 41,
    alignItems: "center",
  },
  imageWrapper: {
    marginTop: responsiveMargin(15),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: responsiveWidth(90),
    height: responsiveHeight(90),
    borderRadius: 100,
    backgroundColor: "#E6eeee",
  },
  imageContainer: {
    width: responsiveWidth(80),
    height: responsiveHeight(80),
    backgroundColor: "#075856",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  modalText: {
    fontFamily: "Outfit_Regular",
    fontSize: responsiveFontSize(14),
    width: "90%",
    textAlign: "center",
  },
  modalHeading: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(20),
    marginTop: responsivePadding(15),
  },
});
