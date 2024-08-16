import React from "react";
import PlanCard from "./PlanCard";

const PremiumPlan = ({ isButtonPressed, handleButtonPress }) => {
  const features = [
    { lightText: "All features in", darkText: "StartUp" },
    { lightText: "Growth", darkText: "Oriented" },
    { lightText: "Support", darkText: "chat" },
  ];

  return (
    <PlanCard
      planName="Premium Plan"
      price="$35"
      duration="/Yearly"
      features={features}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={isButtonPressed}
      handleButtonPress={handleButtonPress}
    />
  );
};

export default PremiumPlan;
