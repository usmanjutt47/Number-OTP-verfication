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
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
  return (size * width) / 375;
};

const responsiveIconSize = (size) => {
  return (size * width) / 375;
};

const responsiveWidth = (size) => {
  return (size * width) / 375;
};

const responsiveHeight = (size) => {
  return (size * height) / 812;
};

const responsivePadding = (size) => {
  return (size * width) / 375;
};

export default function CustomTopNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeScreen = route.name;
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogoutPress = () => {
    setModalVisible(true); // Show the modal when the logout button is pressed
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Hide the modal when the close button is pressed
  };

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
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
            modalVisible && styles.inactiveButton, // Disable button if modal is visible
          ]}
          onPress={() => handlePress("Favorite")}
          disabled={modalVisible} // Disable if modal is active
        >
          <AntDesign name="staro" size={responsiveIconSize(24)} color="black" />
        </Pressable>

        <Pressable
          style={[
            styles.button,
            activeScreen === "AllChats" && styles.activeButton,
            modalVisible && styles.inactiveButton, // Disable button if modal is visible
          ]}
          onPress={() => handlePress("AllChats")}
          disabled={modalVisible} // Disable if modal is active
        >
          <AntDesign name="inbox" size={responsiveIconSize(24)} color="black" />
        </Pressable>

        {/* <Pressable
          style={[
            styles.button,
            activeScreen === "Profile" && styles.activeButton,
            modalVisible && styles.inactiveButton, // Disable button if modal is visible
          ]}
          onPress={() => handlePress("Profile")}
          disabled={modalVisible} // Disable if modal is active
        >
          <Feather name="send" size={responsiveIconSize(24)} color="black" />
        </Pressable> */}
      </View>

      <Pressable
        style={[
          styles.logout,
          modalVisible
            ? styles.activeLogoutButton
            : styles.inactiveLogoutButton, // Change styles based on modal visibility
        ]}
        onPress={handleLogoutPress}
      >
        <MaterialCommunityIcons name="logout" size={24} color="black" />
      </Pressable>

      {/* Modal for the popup */}
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
                <MaterialCommunityIcons name="logout" size={24} color="#fff" />
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
                bottom: "10%",
              }}
            >
              <Pressable style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Discard</Text>
              </Pressable>
              <Pressable
                style={styles.logoutButton}
                onPress={() => navigation.navigate("OnBoarding")}
              >
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
    backgroundColor: "transparent", // Make inactive buttons transparent
  },
  logout: {
    height: responsiveHeight(53),
    width: responsiveWidth(53),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: responsiveWidth(30),
  },
  activeLogoutButton: {
    backgroundColor: "#f0f0f1", // Active logout button color
  },
  inactiveLogoutButton: {
    backgroundColor: "transparent", // Default logout button color
  },
  activeButton: {
    backgroundColor: "#e0e0e0",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bcbaba",
    marginTop: "15%",
    height: "100%",
    width: "100%",
  },
  modalContent: {
    width: "90%",
    height: responsiveHeight(300),
    backgroundColor: "#fff",
    borderRadius: 41,
    alignItems: "center",
  },
  modalHeading: {
    fontFamily: "Inter_Bold",
    fontSize: 24,
    marginTop: "7%",
  },
  modalText: {
    fontFamily: "Outfit_Regular",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#EAEAEA",
    width: 152,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 41,
  },
  cancelButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  logoutButton: {
    backgroundColor: "#D42222",
    width: 152,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 41,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Outfit_Bold",
  },
  imageWrapper: {
    marginTop: "7%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "#d9d9d9",
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
