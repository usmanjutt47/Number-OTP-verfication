import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

import PlanCard from "./../components/PlanCard";

const SelectPlan = () => {
  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const amount = parseFloat(price.replace("$", "").replace(",", "")) * 100; // Convert price to amount in cents

    console.log(`Plan Name: ${planName}, Amount: ${amount}`);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://192.168.100.6:8080/api/v1/auth/payments",
        {
          amount: Math.round(amount), // Ensure amount is correctly sent to backend
        }
      );

      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error("Client secret is missing");
      }

      console.log("PaymentIntent client secret:", clientSecret);

      // Initialize PaymentSheet with merchantDisplayName
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your Business Name", // Replace with your business name
      });

      if (initError) {
        throw new Error(
          `PaymentSheet initialization failed: ${initError.message}`
        );
      }

      console.log("PaymentSheet initialized successfully");

      // Present PaymentSheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error("Payment error:", presentError);
        Alert.alert("Payment failed", presentError.message);
      } else {
        Alert.alert("Payment successful", "Thank you for your purchase!");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
