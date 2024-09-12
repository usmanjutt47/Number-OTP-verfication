import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URL } from "@env";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * height) / 812;
const responsiveMargin = (size) => (size * height) / 812;

const responsivePadding = (size) => {
  return (size * width) / 375;
};
export default function ReplyLetter() {
  const [replyContent, setReplyContent] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const [letters, setLetters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedItem } = route.params || {};

  const handleReply = async () => {
    try {
      const senderId = await AsyncStorage.getItem("userId");

      if (!senderId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "User ID not found",
        });
        return;
      }

      if (!replyContent.trim()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Content cannot be empty",
        });
        return;
      }

      if (!selectedItem || !selectedItem._id || !selectedItem.senderId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No item selected or missing required IDs",
        });
        return;
      }

      const reciverId = selectedItem.senderId;

      const response = await fetch(`${SERVER_URL}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          content: replyContent,
          letterId: selectedItem._id,
          reciverId: reciverId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setModalVisible(true);
        setReplyContent("");

        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === selectedItem._id
              ? { ...letter, hidden: true }
              : letter
          )
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `Error: ${result.error || result.message}`,
        });
        console.error("Backend Error:", result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to send reply: ${error.message}`,
      });
      console.error("Catch Error:", error);
    }
  };

  const SuccessModal = ({ visible, onClose }) => {
    if (!visible) return null;
    const navigation = useNavigation();

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          navigation.navigate("Home");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [visible, navigation]);

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.imageWrapper}>
            <LottieView
              source={require("../assets/lottie/success.json")}
              style={{
                height: 300,
                width: 300,
                alignSelf: "center",
              }}
              autoPlay
            />
          </View>
        </View>
        <Text
          style={{
            fontSize: responsiveFontSize(25),
            color: "#075856",
            fontFamily: "Kanit_Bold",
          }}
        >
          Sending . . .
        </Text>
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="#4a4a4a"
                style={styles.icon}
              />
            </Pressable>
          </View>
          <MaterialIcons name="mail-outline" size={24} color="#000" />
          <Text style={styles.headerText}>Write Reply</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            multiline
            value={replyContent}
            onChangeText={setReplyContent}
            placeholder="Type here..."
            placeholderTextColor={"#000"}
            cursorColor={"#000"}
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleReply}>
            <Text style={styles.sendButtonText}>Send Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <SuccessModal visible={modalVisible} onClose={closeModal} />

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
  },

  contentContainer: {
    width: "100%",
    height: "95%",
    paddingLeft: "5%",
    backgroundColor: "#ffffff",
    borderRadius: 23,
    position: "absolute",
    bottom: 0,
    elevation: 2,
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
    width: "90%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: "2%",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: responsiveHeight(50),
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(24),
    color: "#000",
    marginLeft: "5%",
  },

  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    fontSize: responsiveFontSize(26),
    fontFamily: "Outfit_Regular",
    width: "100%",
    color: "#000",
    minHeight: responsiveHeight(200),
    borderBottomColor: "#ccc",
  },
  sendButtonText: {
    textAlign: "center",
    fontSize: responsiveFontSize(18),
    color: "#fff",
  },
  backButton: {
    height: 43,
    width: 43,
    backgroundColor: "#f3f3f3",
    borderRadius: 26,
    justifyContent: "center",
    marginRight: responsiveMargin(50),
  },
  icon: {
    alignSelf: "center",
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
    backgroundColor: "transparent",
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
  backButton: {
    height: 43,
    width: 43,
    backgroundColor: "#f3f3f3",
    borderRadius: 26,
    justifyContent: "center",
    marginRight: responsiveMargin(50),
  },
  icon: {
    alignSelf: "center",
  },
});
