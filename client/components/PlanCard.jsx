import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const PlanCard = ({
  planName,
  price,
  duration,
  features,
  iconSource,
  isButtonPressed,
  handleButtonPress,
}) => {
  const colors = {
    primary: "#075856",
    darkGray: "#8B8E97",
    headerColor: "#404D97",
  };

  return (
    <Pressable
      onPress={handleButtonPress}
      style={[
        styles.planCard,
        {
          borderColor: isButtonPressed ? colors.primary : "transparent",
          borderWidth: 2,
        },
      ]}
      accessible={true}
      accessibilityLabel={`${planName} Plan Card`}
    >
      <View style={styles.planHeader}>
        <Image
          source={iconSource}
          style={[
            styles.planIcon,
            { tintColor: isButtonPressed ? colors.primary : "#404D97" },
          ]}
        />
        <Text style={styles.planHeading}>{planName}</Text>
        <Text
          style={[
            styles.planPrice,
            {
              color: isButtonPressed ? colors.primary : colors.headerColor,
            },
          ]}
        >
          {price}
        </Text>
        <Text style={styles.planDuration}>{duration}</Text>
      </View>
      <View style={styles.featuresBox}>
        {features.map((feature, index) => (
          <View key={index} style={styles.row}>
            <Image
              source={require("./../assets/icons/featureStar.png")}
              style={styles.rowsIcon}
            />
            <Text style={styles.lightText}>{feature.lightText}</Text>
            <Text style={styles.darkText}>{feature.darkText}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buyButtonContainer}>
        <Pressable
          style={[
            styles.buyButton,
            {
              backgroundColor: isButtonPressed ? colors.primary : "transparent",
            },
          ]}
          onPress={handleButtonPress}
          accessible={true}
          accessibilityLabel={`Buy ${planName} Plan`}
        >
          <Text
            style={[
              styles.buyButtonText,
              { color: isButtonPressed ? "#FFF" : colors.primary },
            ]}
          >
            Buy Plan
          </Text>
          <Ionicons
            name="arrow-forward"
            size={24}
            color={isButtonPressed ? "#FFF" : colors.primary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  planCard: {
    width: "100%",
    height: "25%",
    marginTop: "10%",
    borderRadius: 24,
    backgroundColor: "#FFF",
  },
  planHeader: {
    width: "90%",
    height: "20%",
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  planIcon: {
    width: 18,
    height: 18,
  },
  planHeading: {
    fontFamily: "Outfit_Medium",
    fontSize: 18,
    marginLeft: "3%",
  },
  planPrice: {
    fontFamily: "Outfit_Medium",
    fontSize: 16,
    marginLeft: "auto",
    marginRight: 4,
  },
  planDuration: {
    color: "#8B8E97",
    fontFamily: "Outfit_Regular",
    fontSize: 16,
  },
  featuresBox: {
    width: "85%",
    alignSelf: "center",
    marginTop: "5%",
    marginLeft: "10%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "1%",
  },
  rowsIcon: {
    width: 12,
    height: 12,
  },
  lightText: {
    color: "#8B8E97",
    fontFamily: "Outfit_Regular",
    fontSize: 12,
    marginLeft: 5,
  },
  darkText: {
    fontFamily: "Outfit_Regular",
    fontSize: 12,
    marginLeft: 5,
  },
  buyButtonContainer: {
    alignItems: "flex-end",
    marginRight: "5%",
    marginTop: "5%",
  },
  buyButton: {
    width: 96,
    height: 41,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#075856",
    flexDirection: "row",
  },
  buyButtonText: {
    fontFamily: "Outfit_Regular",
    fontSize: 12,
  },
});

export default PlanCard;
