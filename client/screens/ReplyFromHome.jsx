import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { SERVER_URL } from "@env";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * height) / 812;
const responsiveMargin = (size) => (size * height) / 812;

const responsivePadding = (size) => {
  return (size * width) / 375;
};

export default function ReplyFromHome() {
  const [replyContent, setReplyContent] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);

  const { letterId, letterSenderId } = route.params || {};

  const handleReply = async () => {
    try {
      const senderId = await AsyncStorage.getItem("userId");

      if (!senderId) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "User ID not found",
          visibilityTime: 2000,
        });
        return;
      }

      if (!replyContent.trim()) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Reply cannot be empty",
          visibilityTime: 2000,
        });
        return;
      }

      if (!letterId || !letterSenderId) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "No item selected or missing required IDs",
          visibilityTime: 2000,
        });
        return;
      }

      const payload = {
        senderId: senderId,
        content: replyContent,
        letterId: letterId,
        reciverId: letterSenderId,
        hidden: true,
      };

      const response = await fetch(`${SERVER_URL}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setModalVisible(true);
        setReplyContent("");
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: `Error: ${result.error || result.message}`,
          visibilityTime: 2000,
        });
        console.error("Backend Error:", result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: `Failed to send reply: ${error.message}`,
        visibilityTime: 2000,
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
            placeholderTextColor="#000"
            cursorColor="#000"
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
  header: {
    height: responsiveHeight(50),
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(24),
    color: "#000",
    marginLeft: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  textInput: {
    fontFamily: "Outfit_Regular",
    fontSize: 18,
    paddingRight: 20,
    width: "100%",
    textAlign: "justify",
    marginBottom: responsiveHeight(20),
  },
  sendButton: {
    backgroundColor: "#075856",
    width: "90%",
    height: 62,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 35,
    position: "absolute",
    bottom: responsiveHeight(10),
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
