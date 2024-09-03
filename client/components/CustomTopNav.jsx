import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUnreadMessages } from "../context/UnreadMessagesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveIconSize = (size) => (size * width) / 375;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsivePadding = (size) => (size * width) / 375;

export default function CustomTopNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeScreen = route.name;
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { totalUnreadMessages } = useUnreadMessages();

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      console.log("User ID removed successfully");
      setModalVisible(false);
      navigation.navigate("OnBoarding");
    } catch (error) {
      console.error("Failed to remove the user ID:", error);
    }
  };

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

  return (
    <View style={styles.container}>
      <Pressable style={styles.logo} onPress={() => handlePress("Home")}>
        <Text style={styles.logoText}>Logo</Text>
      </Pressable>

      <View style={styles.centerContainer}>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Favorite" && styles.activeButton,
            modalVisible && styles.inactiveButton,
          ]}
          onPress={() => handlePress("Favorite")}
          disabled={modalVisible}
        >
          <Image
            source={
              activeScreen === "Favorite"
                ? require("../assets/icons/fillFav.png")
                : require("../assets/icons/fav.png")
            }
            style={{
              height: 22,
              width: 22,
              tintColor: "#4A4A4A",
              resizeMode: "contain",
            }}
          />
        </Pressable>

        <Pressable
          style={[
            styles.button,
            activeScreen === "AllChats" && styles.activeButton,
            modalVisible && styles.inactiveButton,
          ]}
          onPress={() => handlePress("AllChats")}
          disabled={modalVisible}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={
                activeScreen === "AllChats"
                  ? require("../assets/icons/fillInbox.png")
                  : require("../assets/icons/inbox.png")
              }
              style={{
                height: 22,
                width: 22,
                tintColor: "#4A4A4A",
                resizeMode: "contain",
              }}
            />
            {activeScreen !== "AllChats" && totalUnreadMessages > 0 && (
              <Pressable
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: "#fff",
                  resizeMode: "contain",
                  position: "absolute",
                  justifyContent: "center",
                  borderRadius: 44,
                  right: -5,
                  top: -7,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    fontFamily: "Outfit_Regular",
                  }}
                >
                  {totalUnreadMessages}
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.logout,
          (activeScreen === "Logout" && styles.activeLogoutButton) ||
          modalVisible
            ? styles.activeLogoutButton
            : styles.inactiveLogoutButton,
        ]}
        onPress={() => handlePress("Logout")}
      >
        <Image
          source={require("../assets/icons/logout.png")}
          style={{
            height: responsiveHeight(23),
            width: responsiveHeight(23),
            tintColor: "#4A4A4A",
          }}
        />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.imageWrapper}>
              <Animated.View
                style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
              />
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/icons/logout.png")}
                  style={{
                    height: responsiveHeight(23),
                    width: responsiveHeight(23),
                  }}
                />
              </View>
            </View>
            <Text style={styles.modalHeading}>Logout</Text>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
                position: "absolute",
                bottom: "5%",
              }}
            >
              <Pressable style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Discard</Text>
              </Pressable>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "5%",
    zIndex: 100,
    position: "relative",
  },
  logo: {
    width: responsiveWidth(53),
    height: responsiveHeight(53),
    borderRadius: responsiveWidth(100),
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: responsiveFontSize(16),
  },
  centerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "40%",
  },
  button: {
    height: responsiveHeight(53),
    width: responsiveWidth(53),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidth(30),
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  logout: {
    height: responsiveHeight(53),
    width: responsiveWidth(53),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: responsiveWidth(30),
  },
  activeLogoutButton: {
    backgroundColor: "#E3E1E1",
  },
  inactiveLogoutButton: {
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "#E3E1E1",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginTop: responsivePadding(65),
    height: "100%",
    width: "100%",
  },
  modalContent: {
    width: "90%",
    height: responsiveHeight(250),
    backgroundColor: "#fff",
    borderRadius: 41,
    alignItems: "center",
  },
  modalHeading: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(24),
    marginTop: responsivePadding(15),
  },
  modalText: {
    fontFamily: "Outfit_Regular",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    width: responsiveWidth(148),
    height: responsiveHeight(48),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 41,
  },
  cancelButtonText: {
    color: "#075856",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  logoutButton: {
    backgroundColor: "#FFE7E7",
    width: responsiveWidth(148),
    height: responsiveHeight(48),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 41,
  },
  logoutButtonText: {
    color: "#D42222",
    fontSize: 16,
    fontFamily: "Outfit_Bold",
  },
  imageWrapper: {
    marginTop: "6%",
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
});
