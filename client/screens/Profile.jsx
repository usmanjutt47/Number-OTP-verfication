import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomTopNav from "../components/CustomTopNav";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          // marginTop: responsiveHeight(20),
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
      console.error("Fetch error:", error);
      ToastAndroid.show("Failed to fetch replies", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View
        style={{
          width: "96%",
          alignSelf: "center",
          marginTop: responsiveHeight(20),
        }}
      >
        <CustomTopNav />
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={replies}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ReplyCard reply={item} />}
        contentContainerStyle={styles.contentContainer}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("WriteLetter")}
        style={{
          position: "absolute",
          bottom: responsiveHeight(20),
          right: responsiveWidth(20),
          height: responsiveHeight(62),
          width: responsiveWidth(62),
          backgroundColor: "#054746",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 31,
        }}
      >
        <Image
          source={require("../assets/icons/add.png")}
          style={{
            height: responsiveIconSize(20),
            width: responsiveIconSize(20),
            alignSelf: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: responsiveHeight(20),
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: responsivePadding(10),
    marginBottom: responsiveHeight(10),
  },
});
