import React, { useState } from "react";
import PlanCard from "./PlanCard";

const BasicPlan = ({ isButtonPressed, handleButtonPress }) => {
  const features = [
    { lightText: "Get Started With", darkText: "messaging" },
    { lightText: "Flexible", darkText: "team meeting" },
    { lightText: "Support", darkText: "chat" },
  ];

  return (
    <PlanCard
      planName="Basic Plan"
      price="$10"
      duration="/weekly"
      features={features}
      iconSource={require("./../assets/icons/blur-icon.png")}
      isButtonPressed={isButtonPressed}
      handleButtonPress={handleButtonPress}
    />
  );
};

export default BasicPlan;
