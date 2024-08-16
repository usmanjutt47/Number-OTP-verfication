import React from "react";
import PlanCard from "./PlanCard";

const StandardPlan = ({ isButtonPressed, handleButtonPress }) => {
  const features = [
    { lightText: "All features in", darkText: "Basic Plan" },
    { lightText: "Priority", darkText: "support" },
    { lightText: "Advanced", darkText: "analytics" },
  ];

  return (
    <PlanCard
      planName="Standard Plan"
      price="$20"
      duration="/monthly"
      features={features}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={isButtonPressed}
      handleButtonPress={handleButtonPress}
    />
  );
};

export default StandardPlan;
