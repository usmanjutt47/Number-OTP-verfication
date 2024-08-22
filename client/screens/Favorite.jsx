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
import CustomTopNav from "../components/CustomTopNav";

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

const API_BASE_URL = "http://192.168.100.140:8080/api/v1/auth/getFavorites";

export default function Favorite() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const scrollX = new Animated.Value(0);
  const bottomSheetRef = useRef(null);
  const replyBottomSheetRef = useRef(null);
  const [content, setContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [noFavorites, setNoFavorites] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const handleFavoriteClick = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found.");
        return;
      }

      const data = {
        userId,
        letterId: selectedItem._id,
      };

      console.log("Sending request with data:", data);

      const response = await axios.post(
        "http://192.168.100.140:8080/api/v1/auth/addToFavorite",
        data
      );

      if (response.data.success) {
        setIsFavorite(true);
        console.log("Letter added to favorites successfully.");
      } else {
        console.error(
          "Failed to add letter to favorites. Server response:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "Error occurred while adding to favorites:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(API_BASE_URL, { params: { userId } });

        if (response.data && response.data.success) {
          setFavorites(response.data.favorites);
        } else {
          console.error(
            response.data?.message || "Failed to fetch favorite letters."
          );
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
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
    setSelectedItem(item);
    bottomSheetRef.current?.expand();
  };

  const handleReply = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        ToastAndroid.show("User ID not found", ToastAndroid.SHORT);
        return;
      }

      if (!replyContent.trim()) {
        ToastAndroid.show("Content cannot be empty", ToastAndroid.SHORT);
        return;
      }

      if (!selectedItem || !selectedItem._id) {
        ToastAndroid.show("No item selected", ToastAndroid.SHORT);
        return;
      }

      const response = await fetch(
        "http://192.168.100.140:8080/api/v1/auth/reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            content: replyContent,
            letterId: selectedItem._id,
          }),
        }
      );

      const rawResponse = await response.text();
      const result = JSON.parse(rawResponse);

      if (response.ok) {
        ToastAndroid.show("Reply sent successfully", ToastAndroid.SHORT);
        setReplyContent("");
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === selectedItem._id
              ? { ...letter, replied: true }
              : letter
          )
        );
        bottomSheetRef.current?.close();
      } else {
        ToastAndroid.show(`Error: ${result.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(
        `Failed to send reply: ${error.message}`,
        ToastAndroid.SHORT
      );
      console.log(`Failed to send reply: ${error.message}`);
    }
  };

  const handleReplyBottomSheetOpen = () => {
    replyBottomSheetRef.current?.expand();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#bcbaba" }}>
      <View style={{ padding: "5%" }}>
        <CustomTopNav />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.centered} />
      ) : error ? (
        <Text style={styles.centered}>{error}</Text>
      ) : favorites.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noPostsText}>No favorite letters found</Text>
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
          data={favorites}
          keyExtractor={(item) => item._id.toString()}
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
                      transform: [{ translateY }, { scale }],
                    },
                  ]}
                >
                  <Animated.Image
                    source={{ uri: item.content }}
                    style={[
                      styles.carouselImage,
                      {
                        transform: [{ translateY }, { scale }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.overlay,
                      {
                        transform: [{ translateY }, { scale }],
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
                      transform: [{ translateY }, { scale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleReplyBottomSheetOpen}
                  >
                    <FontAwesome5 name="pen" size={20} style={styles.icon} />
                    <Text style={styles.buttonText}>Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "50%", "85%"]}
        enablePanDownToClose
      >
        <ScrollView contentContainerStyle={styles.bottomSheetContent}>
          {selectedItem && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.bottomSheetTitle}>Anonymous</Text>
                <Pressable
                  onPress={handleFavoriteClick}
                  style={{
                    height: responsiveHeight(53),
                    width: responsiveWidth(53),
                    backgroundColor: "#FFF8E4",
                    borderRadius: 50,
                    justifyContent: "center",
                  }}
                >
                  {isFavorite ? (
                    <Image
                      source={require("../assets/icons/star.png")}
                      style={{
                        height: responsiveHeight(20),
                        width: responsiveWidth(20),
                        alignSelf: "center",
                      }}
                    />
                  ) : (
                    <AntDesign
                      name="staro"
                      size={25}
                      color="#FFCD26"
                      style={{ alignSelf: "center" }}
                    />
                  )}
                </Pressable>
              </View>
              <Text style={styles.bottomSheetContentText}>
                {selectedItem.content}
              </Text>
              <TouchableOpacity
                style={styles.replyButton}
                onPress={handleReplyBottomSheetOpen}
              >
                <Text style={styles.replyButtonText}>Reply Now</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        ref={replyBottomSheetRef}
        snapPoints={["25%", "50%", "85%"]}
        index={-1}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          <View
            style={{
              height: responsiveHeight(50),
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MaterialIcons name="mail-outline" size={20} color="#000" />
            <Text
              style={{
                fontFamily: "Inter_Bold",
                fontSize: responsiveFontSize(24),
              }}
            >
              Write Reply
            </Text>
          </View>
          <ScrollView>
            <TextInput
              multiline
              value={replyContent}
              onChangeText={setReplyContent}
              placeholder="Type here..."
              placeholderTextColor={"#000"}
              cursorColor={"#000"}
              style={{
                fontSize: responsiveFontSize(26),
                fontFamily: "Outfit_Regular",
                width: responsiveHeight(200),
              }}
            />
            <TouchableOpacity
              onPress={handleReply}
              style={{
                width: "100%",
                height: responsiveHeight(62),
                backgroundColor: "#075856",
                justifyContent: "center",
                borderRadius: 44,
                alignSelf: "center",
                marginTop: responsiveHeight(500),
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveFontSize(18),
                  color: "#fff",
                }}
              >
                Send Now
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BottomSheet>
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
});
