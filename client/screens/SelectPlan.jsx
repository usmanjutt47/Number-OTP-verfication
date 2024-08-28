import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

import PlanCard from "./../components/PlanCard";
import { getUserId } from "../utils/asyncStorage";

const SelectPlan = () => {
  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

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

  // Mapping of plan names to prices
  const planDetails = {
    "Basic Plan": "$10",
    "Standard Plan": "$20",
    "Premium Plan": "$35",
  };

  const handlePlanPress = async (planName) => {
    setActivePlan(planName);
    const price = planDetails[planName];
    const amount = parseFloat(price.replace("$", "").replace(",", "")) * 100;

    console.log(`Plan Name: ${planName}, Amount: ${amount}`);

    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Make sure the URL is correct and matches your backend route
      const response = await axios.post(
        "http://192.168.10.14:8080/api/v1/auth/payments",
        {
          amount: Math.round(amount),
          userId: userId, // Include user ID in the request
          subscriptionPlan: planName.toLowerCase(), // Ensure the subscription plan matches your backend
        }
      );

      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error("Client secret is missing");
      }

      console.log("PaymentIntent client secret:", clientSecret);
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your Business Name",
      });

      if (initError) {
        throw new Error(
          `PaymentSheet initialization failed: ${initError.message}`
        );
      }

      console.log("PaymentSheet initialized successfully");

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        logError(presentError);
        Alert.alert("Payment failed", presentError.message);
      } else {
        // Payment is successful, update the hasPlan state
        Alert.alert("Payment successful", "Thank you for your purchase!");

        // Optionally, you could update local state or trigger other actions
        setHasPlan(true); // Assuming you have this in your state

        // Optionally navigate to another screen or update the UI
      }
    } catch (error) {
      logError(error);
      Alert.alert(
        "Error",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logError = (error) => {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error details:", error);
    }
    console.error("Error stack:", error.stack);
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
          isButtonPressed={activePlan === "Basic Plan"}
          handleButtonPress={() => handlePlanPress("Basic Plan")}
        />
        {/* Standard Plan Component */}
        <PlanCard
          planName="Standard Plan"
          price="$20"
          duration="/monthly"
          features={featuresS}
          iconSource={require("./../assets/icons/blur-icon.png")}
          isButtonPressed={activePlan === "Standard Plan"}
          handleButtonPress={() => handlePlanPress("Standard Plan")}
        />

        {/* Premium Plan Component */}
        <PlanCard
          planName="Premium Plan"
          price="$35"
          duration="/Yearly"
          features={featuresP}
          iconSource={require("./../assets/icons/blur-icon.png")}
          isButtonPressed={activePlan === "Premium Plan"}
          handleButtonPress={() => handlePlanPress("Premium Plan")}
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
