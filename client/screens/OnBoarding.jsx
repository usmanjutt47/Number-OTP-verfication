import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import CustomSlider from "../components/CustomSlider";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function OnBoarding() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground
        source={require("../assets/images/main_img.png")}
        style={styles.imageBackground}
      >
        <Image
          source={require("../assets/images/image.png")}
          style={styles.mainImage}
        />
        <Text style={styles.logoText}>Logo</Text>
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>Modern Way Of</Text>
          <Text style={styles.mainHeading}>Managing Finance</Text>
        </View>
        <View style={styles.punchLineContainer}>
          <Text style={styles.punchLineText}>
            In publishing and graphic design, Lorem ipsum is a
          </Text>
          <Text style={styles.punchLineText}>
            placeholder text commonly used to form of a
          </Text>
          <Text style={styles.punchLineText}>document or a typeface.</Text>
        </View>
        <View style={styles.sliderContainer}>
          <CustomSlider
            onSwipe={() => navigation.navigate("EmailVerification")}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "3%",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    borderRadius: 19,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: height * 0.33,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
  },
  logoText: {
    color: "#000000",
    fontSize: 36,
    position: "absolute",
    top: 10,
    left: 10,
    fontFamily: "Kanit_Bold",
  },
  headingContainer: {
    position: "absolute",
    top: height * 0.45,
    width: "100%",
    alignItems: "center",
  },
  mainHeading: {
    fontSize: width * 0.08,
    color: "#fff",
    fontFamily: "Outfit_Bold",
    textAlign: "center",
  },
  punchLineContainer: {
    position: "absolute",
    top: height * 0.6,
    width: "100%",
    alignItems: "center",
  },
  punchLineText: {
    fontSize: width * 0.04,
    color: "#fff",
    fontFamily: "Outfit_Regular",
    textAlign: "center",
  },
  sliderContainer: {
    position: "absolute",
    bottom: height * 0.05,
    width: "100%",
    alignItems: "center",
  },
});
