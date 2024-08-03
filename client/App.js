import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SendOtpScreen from "./src/screens/SendOtpScreen";
import VerifyOtpScreen from "./src/screens/VerifyOtpScreen";
import { useFonts } from "expo-font";
import CustomKeyboard from "./components/CustomKeyboard";
import NumberVerification from "./src/screens/NumberVerification";
import OnBoarding from "./src/screens/OnBoarding";

const Stack = createStackNavigator();

const App = () => {
  const [loaded] = useFonts({
    Outfit_Black: require("../client/assets/fonts/Outfit-Black.ttf"),
    Outfit_Bold: require("../client/assets/fonts/Outfit-Bold.ttf"),
    Outfit_Extra_Bold: require("../client/assets/fonts/Outfit-ExtraBold.ttf"),
    Outfit_Extra_Light: require("../client/assets/fonts/Outfit-ExtraLight.ttf"),
    Outfit_Light: require("../client/assets/fonts/Outfit-Light.ttf"),
    Outfit_Medium: require("../client/assets/fonts/Outfit-Medium.ttf"),
    Outfit_Regular: require("../client/assets/fonts/Outfit-Regular.ttf"),
    Outfit_Semi_Bold: require("../client/assets/fonts/Outfit-SemiBold.ttf"),
    Outfit_Thin: require("../client/assets/fonts/Outfit-SemiBold.ttf"),
    Kanit_Bold: require("../client/assets/fonts/Kanit-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SendOtp" component={SendOtpScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="CustoomKeyboard" component={CustomKeyboard} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen
          name="NumberVerification"
          component={NumberVerification}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
