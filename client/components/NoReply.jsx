import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import CustomTopNav from "../components/CustomTopNav";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

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

export default function NoReply() {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [showPressable, setShowPressable] = useState(false);

  const handlePress = () => {
    setShowPressable(true);

    setTimeout(() => {
      setShowPressable(false);
    }, 2000);
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
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        {/* <View style={{ marginTop: "10%" }}>
          <CustomTopNav />
        </View> */}
        <View style={styles.imageWrapper}>
          <Animated.View
            style={[styles.circle, { transform: [{ scale: scaleValue }] }]}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/icons/NoPost.png")}
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.headingsContainer}>
          <Text style={styles.heading}>You currently have no posts</Text>
          <Text style={styles.subHeading}>
            Click the button and fill in the information to create a post
          </Text>
        </View>
        <Pressable
          style={{
            marginTop: "10%",
            backgroundColor: "#075856",
            height: 52,
            width: 212,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: 30,
          }}
          onPress={() => navigation.navigate("WriteLetter")} // Navigate to AllChats screen
        >
          <Text style={{ color: "#fff" }}>Create a post</Text>
        </Pressable>
        {/* <View
          style={{
            height: responsiveHeight(324),
            width: responsiveWidth(350),
            backgroundColor: "#F5F5F5",
            borderRadius: 26.22,
            alignSelf: "center",
            marginTop: responsiveHeight(20),
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
                10:30 PM
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
                22.06.2022
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.08)",
                height: responsiveHeight(187),
                width: responsiveWidth(330),
                borderRadius: 24,
                marginTop: responsiveHeight(50),
                overflow: "visible",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  height: responsiveHeight(38),
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
                    alignItems: "center", // Centers the items vertically
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexShrink: 1, // Prevents overflow
                    }}
                  >
                    <Image
                      source={require("../assets/icons/crown.png")}
                      style={{
                        height: responsiveHeight(35),
                        width: responsiveWidth(35),
                      }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 14,
                        fontFamily: "Outfit_Medium",
                        marginLeft: responsiveHeight(10),
                        flexShrink: 1, // Ensures text does not overflow
                      }}
                    >
                      Buy Plan
                    </Text>
                    <TouchableOpacity onPress={handlePress}>
                      <Entypo
                        name="info-with-circle"
                        size={10}
                        color="black"
                        style={{
                          marginLeft: responsiveHeight(2),
                        }}
                      />
                    </TouchableOpacity>

                    {showPressable && (
                      <Pressable
                        style={{
                          backgroundColor: "#e7e7e7",
                          marginTop: responsiveHeight(12),
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                          borderBottomLeftRadius: 10,
                          width: responsiveWidth(180),
                          justifyContent: "center",
                          marginLeft: responsiveHeight(2),
                        }}
                      >
                        <Text
                          style={{
                            color: "#131313",
                            textAlign: "center",
                            fontFamily: "Outfit_Regular",
                          }}
                        >
                          Message Shown After Buy the Plan
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      height: responsiveHeight(27),
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
                <BlurView intensity={50} style={{}}>
                  <Text style={{ fontSize: 16, color: "#000" }}>
                    The 2024 Bugatti Mistral roadster is more than a roofless
                    Chiron, as we learned from...
                  </Text>
                </BlurView>
              </View>
            </View>
          </View>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: null,
  },
  contentContainer: {
    width: "90%",
    height: "100%",
    alignSelf: "center",
  },
  imageWrapper: {
    marginTop: "50%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#E9E9E9",
  },
  imageContainer: {
    width: 146.1,
    height: 146.1,
    backgroundColor: "#E3E3E3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
  },
  image: {
    width: 56.07,
    height: 56.46,
    borderRadius: 100,
  },
  headingsContainer: {
    marginTop: "15%", // Adjust this value to move the container down
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  subHeading: {
    marginTop: "3%",
    fontSize: 12,
    alignSelf: "center",
    textAlign: "center",
  },
});
