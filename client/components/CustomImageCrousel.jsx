import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;

const responsiveFontSize = (size) => (size * width) / 375;
const responsivePadding = (size) => (size * width) / 375;
const responsiveMargin = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsiveWidth = (size) => (size * width) / 375;

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return {
    time: `${formattedHours}:${formattedMinutes} ${period}`,
    date: `${day.toString().padStart(2, "0")}.${month
      .toString()
      .padStart(2, "0")}.${year}`,
  };
};

export default function CustomImageCarousel() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const scrollX = new Animated.Value(0);
  const bottomSheetRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  const handlePass = async (letterId) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        ToastAndroid.show("User ID not found", ToastAndroid.SHORT);
        return;
      }

      const response = await axios.post(
        "http://192.168.100.140:8080/api/v1/auth/hideLetter",
        { userId, letterId }
      );

      if (response.data.success) {
        // Update the state to remove the passed letter
        setLetters((prevLetters) =>
          prevLetters.filter((letter) => letter._id !== letterId)
        );
        ToastAndroid.show("Letter passed successfully", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          `Error: ${response.data.message}`,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      ToastAndroid.show(
        `Failed to pass letter: ${error.message}`,
        ToastAndroid.SHORT
      );
      console.log(`Failed to pass letter: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://192.168.100.140:8080/api/v1/auth/letters`,
          { params: { userId } }
        );

        if (response.data.success) {
          setLetters(response.data.letters);
        } else {
          setError("Failed to fetch letters.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching letters.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#fff" style={styles.centered} />
    );
  }

  if (error) {
    return <Text style={styles.centered}>{error}</Text>;
  }

  const handleOpenBottomSheet = (item) => {
    navigation.navigate("ViewLetter", { letter: item });
  };

  const handleReplyBottomSheetOpen = (item) => {
    navigation.navigate("ReplyLetter", { selectedItem: item });
  };

  return (
    <View style={{ flex: 1 }}>
      {letters.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noPostsText}>No posts available</Text>
        </View>
      ) : (
        <Animated.FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          data={letters}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [-width * 0.7, 0, width * 0.7],
              extrapolate: "clamp",
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [1.1, 1, 1.1],
              extrapolate: "clamp",
            });

            const { time, date } = formatDateTime(item.createdAt);

            return (
              <Pressable
                onPress={() => handleOpenBottomSheet(item)}
                style={styles.carouselItem}
              >
                <Animated.View
                  style={[
                    styles.carouselImageContainer,
                    {
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      transform: [{ translateY: translateY }, { scale: scale }],
                    },
                  ]}
                >
                  <Animated.Image
                    source={{ uri: item.content }}
                    style={[
                      styles.carouselImage,
                      {
                        transform: [
                          { translateY: translateY },
                          { scale: scale },
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.overlay,
                      {
                        transform: [
                          { translateY: translateY },
                          { scale: scale },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.infoContainer}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>Anonymous</Text>
                        <Text style={styles.infoTime}>{time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoSubtitle}>
                          The Number 1 Secret Of Success
                        </Text>
                        <Text style={styles.infoDate}>{date}</Text>
                      </View>
                    </View>
                    <Animated.View style={styles.textContainer}>
                      <Text
                        style={styles.textContent}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.content}
                      </Text>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
                <Animated.View
                  style={[
                    styles.container,
                    {
                      transform: [{ translateY: translateY }, { scale: scale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleReplyBottomSheetOpen(item);
                    }}
                  >
                    <FontAwesome5 name="pen" size={20} style={styles.icon} />
                    <Text style={styles.buttonText}>Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePass(item._id)}
                  >
                    <Image
                      source={require("../assets/icons/pass.png")}
                      style={styles.imageIcon}
                    />
                    <Text style={styles.buttonText}>Pass</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Pressable>
            );
          }}
        />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: responsiveFontSize(20),
    color: "#000",
    textAlign: "center",
    fontFamily: "Outfit_Medium",
  },
  carouselItem: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.3,
  },
  carouselImageContainer: {
    overflow: "hidden",
    alignItems: "center",
    borderRadius: 20,
  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: "5%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoTitle: {
    color: "#000",
    fontSize: responsiveFontSize(27),
    fontFamily: "Outfit_Medium",
  },
  infoTime: {
    color: "#000",
    fontSize: responsiveFontSize(24),
    fontFamily: "Outfit_Medium",
  },
  infoSubtitle: {
    color: "#C9C9C9",
    fontSize: responsiveFontSize(14),
    fontFamily: "Outfit_Regular",
  },
  infoDate: {
    color: "#C9C9C9",
    fontFamily: "Outfit_Medium",
  },
  textContainer: {
    height: "65%",
    width: "90%",
    backgroundColor: "#F0F0F1",
    justifyContent: "center",
    borderRadius: 24,
    padding: "5%",
    marginTop: responsiveHeight(60),
  },
  textContent: {
    fontSize: responsiveFontSize(27),
    fontFamily: "Outfit_Medium",
    color: "#000",
    alignSelf: "center",
  },
  bottomSheetContent: {
    padding: "5%",
    height: "100%",
    width: "100%",
    flexGrow: 1,
  },
  bottomSheetTitle: {
    color: "#000",
    fontSize: responsiveFontSize(24),
    fontFamily: "Inter_Bold",
  },
  bottomSheetContentText: {
    fontSize: responsiveFontSize(24),
    fontFamily: "Outfit_Regular",
    color: "#000",
    width: "100%",
    flexGrow: 1,
  },
  replyButton: {
    height: 62,
    width: "100%",
    backgroundColor: "#075856",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 44,
    marginTop: responsiveHeight(100),
  },
  replyButtonText: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Outfit_Medium",
    textAlign: "center",
    color: "#fff",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "5%",
    marginTop: responsiveHeight(20),
  },
  button: {
    height: responsiveHeight(62),
    width: responsiveWidth(160),
    backgroundColor: "#fff",
    borderRadius: responsiveHeight(34),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: {
    color: "#515151",
  },
  imageIcon: {
    height: responsiveHeight(25),
    width: responsiveHeight(25),
    tintColor: "#515151",
  },
  buttonText: {
    fontSize: responsiveFontSize(19),
    fontFamily: "Outfit_Medium",
    color: "#515151",
    marginRight: responsiveMargin(40),
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flatList: {
    flex: 1, // Ensure FlatList takes the remaining space
  },
});
