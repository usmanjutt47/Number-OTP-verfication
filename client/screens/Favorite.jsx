import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  Easing,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomTopNav from "../components/CustomTopNav";
import { SERVER_URL } from "@env";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;

const responsivePadding = (size) => (size * width) / 375;
const responsiveMargin = (size) => (size * width) / 375;
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

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noFavorites, setNoFavorites] = useState(false);
  const scrollX = new Animated.Value(0);
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavoriteLetters = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `${SERVER_URL}/letter/favorites/${userId}`
      );
      if (response.data.favorites.length === 0) {
        setNoFavorites(true);
      } else {
        setFavorites(response.data.favorites);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorite letters:", error);
      setError("Error fetching favorite letters");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteLetters();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavoriteLetters().finally(() => setRefreshing(false));
    // fetchLetters().finally(() => setRefreshing(false));
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

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#fff" style={styles.centered} />
    );
  }

  if (error) {
    return <Text style={styles.centered}>{error}</Text>;
  }

  const handleHideLetter = async (letterId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_URL}/letter/hide-letter/${String(letterId)}`
      );
    } catch (err) {
      console.error("Error hiding letter:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // const toggleFavorite = async () => {
  //   setLoading(true);
  //   try {
  //     const userId = await AsyncStorage.getItem("userId");
  //     if (!userId) {
  //       throw new Error("User ID not found");
  //     }

  //     // Determine the new favorite status
  //     const newFavoriteStatus = !isFavorite;

  //     // Update favorite status on the server
  //     await axios.put(`${SERVER_URL}/letter/toggle-favorite/${letter._id}`, {
  //       userId,
  //     });

  //     // Update local state and AsyncStorage
  //     setIsFavorite(newFavoriteStatus);
  //     await AsyncStorage.setItem(
  //       `favorite-${letter._id}`,
  //       newFavoriteStatus ? "true" : "false"
  //     );

  //     // Hide the letter
  //     await axios.put(`${SERVER_URL}/letter/hide/${letter._id}`, {
  //       userId,
  //       isVisible: false, // or true if you want to show it again
  //     });

  //     navigation.goBack();
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: "An error occurred. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (noFavorites) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <View style={{ padding: "5%" }}>
          <CustomTopNav />
        </View>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.imageWrapper}>
              <Animated.View
                style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
              />
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/icons/fillFav.png")}
                  style={{
                    height: responsiveHeight(23),
                    width: responsiveHeight(23),
                    tintColor: "#fff",
                  }}
                />
              </View>
            </View>
            <Text style={styles.modalHeading}>No Favorites Yet</Text>
            <Text style={styles.modalText}>
              It looks like you haven't added any items to your favorites yet.
              Start adding items to create your favorite list!
            </Text>
          </View>
          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate("WriteLetter")}
          >
            <Image
              source={require("../assets/icons/add.png")}
              style={{
                height: responsiveHeight(25),
                width: responsiveWidth(25),
              }}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  const handleOpenBottomSheet = (item) => {
    navigation.navigate("ViewLetter", { letter: item });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: "5%" }}>
        <CustomTopNav />
      </View>
      {favorites.length === 0 ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.imageWrapper}>
              <Animated.View
                style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
              />
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/icons/fillFav.png")}
                  style={{
                    height: responsiveHeight(23),
                    width: responsiveHeight(23),
                    tintColor: "#fff",
                  }}
                />
              </View>
            </View>
            <Text style={styles.modalHeading}>No Favorites Yet</Text>
            <Text style={styles.modalText}>
              It looks like you haven't added any items to your favorites yet.
              Start adding items to create your favorite list!
            </Text>
          </View>
          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate("WriteLetter")}
          >
            <Image
              source={require("../assets/icons/add.png")}
              style={{
                height: responsiveHeight(25),
                width: responsiveWidth(25),
              }}
            />
          </Pressable>
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
          onRefresh={handleRefresh}
          refreshing={refreshing}
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
                    styles.cardBehind,
                    {
                      transform: [{ translateY: translateY }, { scale: scale }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.cardBehind2,
                    {
                      transform: [{ translateY: translateY }, { scale: scale }],
                    },
                  ]}
                />
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
                          {/* The Number 1 Secret Of Success */}
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
                    style={[
                      styles.button,
                      {
                        backgroundColor: "#E0E7E6",
                        borderWidth: 1,
                        borderColor: "#075856",
                      },
                    ]}
                    onPress={() => {
                      navigation.navigate("ReplyLetter", {
                        selectedItem: item,
                      });
                    }}
                  >
                    <Pressable
                      style={{
                        height: responsiveHeight(47),
                        width: responsiveWidth(47),
                        backgroundColor: "#fff",
                        borderRadius: 44,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome5 name="pen" size={20} style={styles.icon} />
                    </Pressable>
                    <Text style={styles.buttonText}>Reply</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#FFF2F2" }]}
                    onPress={() => handleHideLetter(item._id)}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#D42222" />
                    ) : (
                      <Pressable
                        style={{
                          height: responsiveHeight(47),
                          width: responsiveWidth(47),
                          backgroundColor: "#fff",
                          borderRadius: 44,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../assets/icons/pass.png")}
                          style={styles.imageIcon}
                        />
                      </Pressable>
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        { marginLeft: responsiveMargin(10), color: "#D42222" },
                      ]}
                    >
                      Pass
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noFavoritesText: {
    fontSize: responsiveFontSize(20),
    color: "#000",
    textAlign: "center",
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
  cardBehind: {
    position: "absolute",
    top: responsiveHeight(50),
    width: "85%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#E0E7E6",
    zIndex: -1,
  },
  cardBehind2: {
    position: "absolute",
    top: responsiveHeight(35),
    width: "78%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#E7EBEB",
    zIndex: -2,
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
    position: "relative",
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
    tintColor: "#D42222",
  },
  buttonText: {
    fontSize: responsiveFontSize(19),
    fontFamily: "Outfit_Medium",
    color: "#075856",
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
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  modalContent: {
    width: "90%",
    height: responsiveHeight(200),
    backgroundColor: "#fff",
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
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
    borderRadius: 99,
    maxHeight: responsiveHeight(80),
    maxWidth: responsiveWidth(80),
  },
  modalText: {
    fontFamily: "Outfit_Regular",
    fontSize: responsiveFontSize(12),
    width: "90%",
    textAlign: "center",
  },
  modalHeading: {
    fontFamily: "Inter_Bold",
    fontSize: responsiveFontSize(20),
    marginTop: responsivePadding(25),
  },
  pressable: {
    position: "absolute",
    bottom: responsiveHeight(20),
    right: responsiveWidth(20),
    backgroundColor: "#075856",
    borderRadius: 50,
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    justifyContent: "center",
    alignItems: "center",
  },
});
