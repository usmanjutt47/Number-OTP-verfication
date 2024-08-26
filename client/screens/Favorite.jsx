import React, { useEffect, useState } from "react";
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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomTopNav from "../components/CustomTopNav";

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

  useEffect(() => {
    const fetchFavoriteLetters = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await axios.get(
          `http://192.168.10.5:8080/api/letter/favorites/${userId}`
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

    fetchFavoriteLetters();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#fff" style={styles.centered} />
    );
  }

  if (error) {
    return <Text style={styles.centered}>{error}</Text>;
  }

  if (noFavorites) {
    return (
      <View style={{ flex: 1, backgroundColor: "#bcbaba" }}>
        <View style={{ padding: "5%" }}>
          <CustomTopNav />
        </View>
        <View style={styles.centered}>
          <Text style={styles.noFavoritesText}>No favorite letters found</Text>
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
          data={favorites} // Use the favorites data here
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
                  <TouchableOpacity style={styles.button}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    flex: 1,
  },
});
