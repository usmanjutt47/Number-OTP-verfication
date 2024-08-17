import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Pressable,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomTopNav from "../components/CustomTopNav";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoReply from "../components/NoReply";

const { width, height } = Dimensions.get("window");

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

const responsiveFontSize = (size) => (size * width) / 375;
const responsiveIconSize = (size) => (size * width) / 375;
const responsiveWidth = (size) => (size * width) / 375;
const responsiveHeight = (size) => (size * height) / 812;
const responsivePadding = (size) => (size * width) / 375;

const ReplyCard = ({ reply }) => {
  const navigation = useNavigation();
  const { time, date } = formatDateTime(reply.createdAt);

  return (
    <View style={styles.card}>
      <View
        style={{
          height: responsiveHeight(300),
          width: responsiveWidth(350),
          backgroundColor: "#F5F5F5",
          borderRadius: 26.22,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            padding: responsivePadding(20),
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(26),
                fontFamily: "Outfit_Medium",
              }}
            >
              Anonymous Reply
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(23),
                fontFamily: "Outfit_Medium",
              }}
            >
              {time}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Outfit_Regular",
                fontSize: responsiveFontSize(14),
                color: "#C9C9C9",
              }}
            >
              Your Receive new reply
            </Text>
            <Text
              style={{
                fontFamily: "Outfit_Medium",
                fontSize: responsiveFontSize(14),
                color: "#C9C9C9",
              }}
            >
              {date}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.08)",
              height: responsiveHeight(187),
              width: responsiveWidth(330),
              borderRadius: 24,
              marginTop: responsiveHeight(30),
              overflow: "visible",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                height: responsiveHeight(60),
                width: responsiveWidth(300),
                backgroundColor: "#fff",
                alignSelf: "center",
                borderRadius: 43,
                marginTop: -responsiveHeight(19),
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 1,
                  }}
                >
                  <Image
                    source={require("../assets/icons/crown.png")}
                    style={{
                      height: responsiveHeight(30),
                      width: responsiveWidth(30),
                      marginLeft: responsiveHeight(10),
                    }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: responsiveFontSize(18),
                      fontFamily: "Outfit_Medium",
                      marginLeft: responsiveHeight(10),
                      flexShrink: 1,
                    }}
                  >
                    Buy Plan
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SelectPlan")}
                  style={{
                    height: responsiveHeight(40),
                    width: responsiveWidth(70),
                    backgroundColor: "#075856",
                    borderRadius: 46,
                    justifyContent: "center",
                    marginRight: responsiveHeight(10),
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontFamily: "Outfit_Bold",
                      fontSize: responsiveFontSize(12),
                    }}
                  >
                    See Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: "100%",
                width: "100%",
                padding: responsivePadding(20),
              }}
            >
              <View>
                <Text>{reply.content}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Profile() {
  const [replies, setReplies] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [showPressable, setShowPressable] = useState(false);

  const fetchReplies = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID is not available");
      }

      const response = await fetch(
        `http://192.168.10.9:8080/api/v1/auth/replies/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setReplies(data);
    } catch (error) {
      // console.error("Fetch error:", error);
      // ToastAndroid.show("Failed to fetch replies", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

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

  const handlePress = () => {
    setShowPressable(true);
    setTimeout(() => {
      setShowPressable(false);
    }, 2000);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={{ marginTop: responsiveHeight(20) }}>
          <CustomTopNav />
        </View>
        {replies.length === 0 ? (
          <NoReply />
        ) : (
          <FlatList
            data={replies}
            renderItem={({ item }) => <ReplyCard reply={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
        {showPressable && (
          <Pressable style={styles.pressable} onPress={() => handlePress()}>
            <Entypo name="plus" size={40} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    width: width,
    padding: responsivePadding(20),
  },
  noRepliesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(50),
    backgroundColor: "#E0E0E0",
    position: "absolute",
    top: -responsiveWidth(50),
    left: width / 2 - responsiveWidth(50),
  },
  imageContainer: {
    height: responsiveHeight(240),
    width: responsiveWidth(240),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(20),
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  headingsContainer: {
    alignItems: "center",
    marginBottom: responsiveHeight(20),
  },
  heading: {
    fontSize: responsiveFontSize(24),
    fontFamily: "Outfit_Bold",
    color: "#000",
  },
  subHeading: {
    fontSize: responsiveFontSize(18),
    fontFamily: "Outfit_Regular",
    color: "#999",
  },
  createPostButton: {
    backgroundColor: "#075856",
    borderRadius: 8,
    padding: responsivePadding(15),
    justifyContent: "center",
    alignItems: "center",
    width: responsiveWidth(220),
  },
  createPostButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(18),
    fontFamily: "Outfit_Bold",
  },
  flatListContainer: {
    paddingBottom: responsiveHeight(20),
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
