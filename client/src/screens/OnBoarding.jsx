import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import CustomSlider from "../../components/CustomSlider";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function OnBoarding() {
  const navigation = useNavigation();

  const handleSwipe = () => {
    navigation.navigate("EmailVerification");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="black" />
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/images/main_img.png")}
          style={styles.topSideImage}
        />

        <Image
          source={require("../../assets/images/image.png")}
          style={styles.mainImage}
        />
        <Text style={styles.logoText}>Logo</Text>
        <View style={styles.textContainer}>
          <Text style={styles.mainHeading}>Modern Way Of Managing Finance</Text>
        </View>
        <View style={styles.punchLineContainer}>
          <Text style={styles.punchLineText}>
            In publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to form of a document or a typeface.
          </Text>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <CustomSlider onSwipe={handleSwipe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  innerContainer: {
    height: "95%",
    width: "90%",
    alignSelf: "center",
  },
  topSideImage: {
    height: "100%",
    width: "100%",
    borderRadius: 19,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  mainImage: {
    width: "100%",
    height: "31%",
    borderRadius: 19,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  logoText: {
    fontFamily: "Kanit_Bold",
    fontSize: width * 0.09,
    padding: width * 0.05,
  },
  textContainer: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: "61%",
  },
  mainHeading: {
    color: "#fff",
    fontSize: 34,
    height: "100%",
    textAlign: "center",
    fontFamily: "Outfit_Bold",
  },
  punchLineContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    top: "72%",
    position: "absolute",
  },
  punchLineText: {
    fontSize: 16,
    fontFamily: "Outfit_Regular",
    color: "#fff",
    textAlign: "center",
  },
  sliderContainer: {
    position: "absolute",
    bottom: "5%",
    alignSelf: "center",
    alignItems: "center",
    width: "70%",
  },
});
