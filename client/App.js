import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import CustomKeyboard from "./components/CustomKeyboard";
import OnBoarding from "./src/screens/OnBoarding";
import EmailVerification from "./src/screens/EmailVerification";
import OTPVerification from "./src/screens/OTPVerification";
import Home from "./src/screens/Home";
import Test from "./Test";

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
    Sf_Pro_Display_Bold: require("../client/assets/fonts/Sf_Pro_Display_Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Test"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CustoomKeyboard" component={CustomKeyboard} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />

        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Test" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
