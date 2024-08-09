import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomKeyboard from "./components/CustomKeyboard";
import OnBoarding from "./screens/OnBoarding";
import EmailVerification from "./screens/EmailVerification";
import OTPVerification from "./screens/OTPVerification";
import Home from "./screens/Home";

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

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

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        {
          /* home added as initial rout */
        }
        setInitialRoute("Home");
      } else {
        setInitialRoute("OnBoarding");
      }
    };

    checkUser();
  }, []);

  if (!loaded || initialRoute === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CustoomKeyboard" component={CustomKeyboard} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
