import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

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
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.heading}>Select Plan</Text>
        </View>
        {/* header ends here */}
        <View style={styles.basicPlanCard}>
          <View style={styles.planHeader}>
            <Image
              source={require("./../assets/icons/blur-icon.png")}
              style={styles.planIcon}
            />
            <Text style={styles.planHeading}>Basic Plan</Text>
            <Text style={styles.planPrice}>$10 </Text>
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
              <Text style={styles.lightText}>Get Started With</Text>
              <Text style={styles.darkText}>messaging</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("./../assets/icons/featureStar.png")}
                style={styles.rowsIcon}
              />
              <Text style={styles.lightText}>Get Started With</Text>
              <Text style={styles.darkText}>messaging</Text>
            </View>
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
    width: 52.21,
    height: 52.21,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  heading: {
    fontFamily: "Outfit_Bold",
    fontSize: 20,
    marginLeft: "5%",
  },
  basicPlanCard: {
    width: "100%",
    height: "20%",
    marginTop: "10%",
    borderRadius: 24,
    backgroundColor: "#FFF",
  },
  planHeader: {
    width: "90%",
    height: "20%",
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
    marginLeft: "40%",
    color: "#404D97",
  },
  planDuration: {
    color: "#8B8E97",
    fontFamily: "Outfit_Regular",
    fontSize: 16,
  },
  featuresBox: {
    width: "60%",
    height: "40%",
    marginTop: "3%",
    marginLeft: "15%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
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
});

export default SelectPlan;
