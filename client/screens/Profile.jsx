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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomTopNav from "../components/CustomTopNav";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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

// const NoReplyCard = () => (
//   <View style={styles.card}>
//     <View
//       style={{
//         height: responsiveHeight(300),
//         width: responsiveWidth(350),
//         backgroundColor: "#F5F5F5",
//         borderRadius: 26.22,
//         alignSelf: "center",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text
//         style={{
//           fontSize: responsiveFontSize(18),
//           fontFamily: "Outfit_Medium",
//         }}
//       >
//         No Replies Available
//       </Text>
//     </View>
//   </View>
// );

export default function Profile() {
  const [userId, setUserId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error("No userId found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error retrieving userId:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!userId) return;

      try {
        console.log("Fetching replies for userId:", userId);
        const response = await axios.get(
          "http://192.168.100.6:8080/api/v1/auth/replies",
          { params: { userId } }
        );

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setReplies(response.data);
          } else {
            console.warn("Unexpected response structure:", response.data);
            setReplies([]);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setReplies([]);
        } else {
          setError(error.message);
          console.error("Error fetching replies:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [userId]);

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
    navigation.navigate("WriteLetter");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

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
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={replies}
            renderItem={({ item }) => <ReplyCard reply={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContainer}
          />
        )}

        <Pressable style={styles.pressable} onPress={handlePress}>
          <Entypo name="plus" size={40} color="white" />
        </Pressable>
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
  card: {
    marginVertical: responsiveHeight(10),
    borderRadius: 26.22,
    backgroundColor: "#F5F5F5",
    width: responsiveWidth(350),
    alignSelf: "center",
  },
});
