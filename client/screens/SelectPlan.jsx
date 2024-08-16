import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BasicPlan from "./../components/BasicPlan";
import StandardPlan from "./../components/StandardPlan";
import PremiumPlan from "./../components/PremiumPlan";

const SelectPlan = () => {
  const navigation = useNavigation();
  const [activePlan, setActivePlan] = useState(null); // Track the active plan

  const handlePlanPress = (plan) => {
    setActivePlan(plan);
  };
  {
    /* cards components are called here */
  }
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
        <BasicPlan
          isButtonPressed={activePlan === "Basic"}
          handleButtonPress={() => handlePlanPress("Basic")}
        />

        {/* Standard Plan Component */}
        <StandardPlan
          isButtonPressed={activePlan === "Standard"}
          handleButtonPress={() => handlePlanPress("Standard")}
        />

        {/* Premium Plan Component */}
        <PremiumPlan
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
});

export default SelectPlan;
