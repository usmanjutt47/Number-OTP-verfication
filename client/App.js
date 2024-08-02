import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SendOtpScreen from "./src/screens/SendOtpScreen";
import VerifyOtpScreen from "./src/screens/VerifyOtpScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SendOtp">
        <Stack.Screen
          name="SendOtp"
          component={SendOtpScreen}
          options={{ title: "Send OTP" }}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtpScreen}
          options={{ title: "Verify OTP" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
