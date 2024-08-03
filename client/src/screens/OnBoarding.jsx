import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import CustomSlider from "../../components/CustomSlider";
import { useNavigation } from "@react-navigation/native";

export default function OnBoarding() {
  const navigation = useNavigation();

  const handleSwipe = () => {
    // Example of navigating to a specific screen
    navigation.navigate("NumberVerification");
  };

  return (
    <View style={styles.container}>
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
      <View
        style={{
          position: "absolute",
          bottom: "5%",
          alignSelf: "center",
        }}
      >
        <CustomSlider onSwipe={handleSwipe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
  },
  innerContainer: {
    height: "100%",
    width: "100%",
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
    height: "30%",
    borderRadius: 19,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  logoText: {
    fontFamily: "Kanit_Bold",
    fontSize: 36,
    padding: "5%",
  },
  textContainer: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: "60%",
  },
  mainHeading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 34,
    fontFamily: "Outfit_Bold",
  },
  punchLineContainer: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: "70%",
  },
  punchLineText: {
    fontSize: 16,
    fontFamily: "Outfit_Regular",
    color: "#fff",
    textAlign: "center",
  },
});
