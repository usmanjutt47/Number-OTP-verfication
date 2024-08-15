import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

// Centralized styles for common properties
const fontStyles = {
  regular: "Outfit_Regular",
  medium: "Outfit_Medium",
  bold: "Outfit_Bold",
};

const colors = {
  primary: "#075856",
  lightGray: "#E0E0E0",
  darkGray: "#8B8E97",
  headerColor: "#404D97",
};

const SelectPlan = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.heading}>Select Plan</Text>
        </View>
        {/* header ends here */}

        {/* basic plan starts here */}
        <View style={styles.basicPlanCard}>
          <View style={styles.planHeader}>
            <Image
              source={require("./../assets/icons/blur-icon.png")}
              style={styles.planIcon}
            />
            <Text style={styles.planHeading}>Basic Plan</Text>
            <Text style={styles.planPrice}>$10</Text>
            <Text style={styles.planDuration}>/weekly</Text>
          </View>
          {/* plan header ended */}
          <View style={styles.featuresBox}>
            <View style={styles.row}>
              <Image
                source={require("./../assets/icons/featureStar.png")}
                style={styles.rowsIcon}
              />
              <Text style={styles.lightText}>Get Started With</Text>
              <Text style={styles.darkText}>messaging</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("./../assets/icons/featureStar.png")}
                style={styles.rowsIcon}
              />
              <Text style={styles.lightText}>Flexible</Text>
              <Text style={styles.darkText}>team meeting</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("./../assets/icons/featureStar.png")}
                style={styles.rowsIcon}
              />
              <Text style={styles.lightText}>Support</Text>
              <Text style={styles.darkText}>chat</Text>
            </View>
          </View>
          {/* feature box ended */}
          <View style={styles.buyButtonContainer}>
            <Pressable
              style={styles.buyButton}
              accessible={true}
              accessibilityLabel="Buy Basic Plan"
            >
              <Text style={styles.buyButtonText}>Buy Plan</Text>
              <Ionicons name="arrow-forward" size={24} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "90%",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: "10%",
    alignItems: "center",
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
  },
  heading: {
    fontFamily: fontStyles.bold,
    fontSize: 20,
    marginLeft: "5%",
  },
  basicPlanCard: {
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
    fontFamily: fontStyles.medium,
    fontSize: 18,
    marginLeft: "3%",
  },
  planPrice: {
    fontFamily: fontStyles.medium,
    fontSize: 16,
    marginLeft: "auto",
    marginRight: 4,
    color: colors.headerColor,
  },
  planDuration: {
    color: colors.darkGray,
    fontFamily: fontStyles.regular,
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
    color: colors.darkGray,
    fontFamily: fontStyles.regular,
    fontSize: 12,
    marginLeft: 5,
  },
  darkText: {
    fontFamily: fontStyles.regular,
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
    borderColor: colors.primary,
    flexDirection: "row",
  },
  buyButtonText: {
    color: colors.primary,
    fontFamily: fontStyles.regular,
    fontSize: 12,
  },
});

export default SelectPlan;
