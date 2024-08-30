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
          <Text style={styles.mainHeading}>Discover the Full</Text>
          <Text style={styles.mainHeading}>Potential of Our App</Text>
        </View>
        <View style={styles.punchLineContainer}>
          <Text style={styles.punchLineText}>
            Get started with a 1-month free trial and explore
          </Text>
          <Text style={styles.punchLineText}>
            everything our app has to offer. No credit card
          </Text>
          <Text style={styles.punchLineText}>required, no obligations.</Text>
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
    tintColor: "#FEFEFE",
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
    fontSize: 16,
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
