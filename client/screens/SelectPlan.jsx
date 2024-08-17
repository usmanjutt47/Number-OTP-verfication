import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import PlanCard from "./../components/PlanCard";

const SelectPlan = () => {
  const navigation = useNavigation();
  const [activePlan, setActivePlan] = useState(null);
  const featuresB = [
    { lightText: "Get Started With", darkText: "messaging" },
    { lightText: "Flexible", darkText: "team meeting" },
    { lightText: "Support", darkText: "chat" },
  ];
  const featuresP = [
    { lightText: "All features in", darkText: "StartUp" },
    { lightText: "Growth", darkText: "Oriented" },
    { lightText: "Support", darkText: "chat" },
  ];
  const featuresS = [
    { lightText: "All features in", darkText: "Basic Plan" },
    { lightText: "Priority", darkText: "support" },
    { lightText: "Advanced", darkText: "analytics" },
  ];
  const handlePlanPress = (plan) => {
    setActivePlan(plan);
  };

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

        {/* Basic Plan Component */}
        <PlanCard
      planName="Basic Plan"
      price="$10"
      duration="/weekly"
      features={featuresB}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={activePlan === "Basic"}
      handleButtonPress={() => handlePlanPress("Basic")}
/>
        {/* Standard Plan Component */}
        <PlanCard
      planName="Standard Plan"
      price="$20"
      duration="/monthly"
      features={featuresS}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={activePlan === "Standard"}
      handleButtonPress={() => handlePlanPress("Standard")}
    />

        {/* Premium Plan Component */}
        <PlanCard
      planName="Premium Plan"
      price="$35"
      duration="/Yearly"
      features={featuresP}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={activePlan === "Premium"}
      handleButtonPress={() => handlePlanPress("Premium")}
    />
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
    backgroundColor: "#E0E0E0",
  },
  heading: {
    fontFamily: "Outfit_Bold",
    fontSize: 20,
    marginLeft: "5%",
  },
  scrollContainer: {
    flexGrow: 1, // Ensure ScrollView takes full available height
    justifyContent: "center", // Center the content vertically
  },
});

export default SelectPlan;
