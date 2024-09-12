import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomKeyboard from "./components/CustomKeyboard";
import CustomTopNav from "./components/CustomTopNav";

import OnBoarding from "./screens/OnBoarding";
import EmailVerification from "./screens/EmailVerification";
import OTPVerification from "./screens/OTPVerification";
import Home from "./screens/Home";
import Favorite from "./screens/Favorite";
import AllChats from "./screens/AllChats";
import Profile from "./screens/Profile";
import WriteLetter from "./screens/WriteLetter";
import SelectPlan from "./screens/SelectPlan";
import { StripeProvider } from "@stripe/stripe-react-native";
import ChatDetail from "./components/ChatDetail";
import ViewLetter from "./screens/ViewLetter";
import ReplyLetter from "./screens/ReplyLetter";
import ReplyFromHome from "./screens/ReplyFromHome";
import { UnreadMessagesProvider } from "./context/UnreadMessagesContext";
import Logout from "./screens/Logout";

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("OnBoarding");
        }
      } catch (error) {
        console.error("Error reading userId from AsyncStorage:", error);
        setInitialRoute("OnBoarding"); // Error handling case
      }
    };

    checkUserId();
  }, []);

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
    Inter_Bold: require("../client/assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!loaded || initialRoute === null) {
    return null;
  }

  const PUBLISH_KEY =
    "pk_test_51PnyvfDw0HZ2rXEfHszzvJJfoiyLWKUpejcAP2xOWWkwj3e6eflY3zWFN8OK69FS9NLQPaoz2P1XcZ1XK3OVO79K00Avrtb4N6";

  return (
    <UnreadMessagesProvider>
      <StripeProvider publishableKey={PUBLISH_KEY}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="CustomKeyboard" component={CustomKeyboard} />
            <Stack.Screen name="CustomTopNav" component={CustomTopNav} />

            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerification}
            />
            <Stack.Screen name="OTPVerification" component={OTPVerification} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Favorite" component={Favorite} />
            <Stack.Screen name="AllChats" component={AllChats} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen
              name="WriteLetter"
              component={WriteLetter}
              options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="SelectPlan" component={SelectPlan} />
            <Stack.Screen name="ChatDetail" component={ChatDetail} />
            <Stack.Screen
              name="ViewLetter"
              component={ViewLetter}
              options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
              name="ReplyLetter"
              component={ReplyLetter}
              options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
              name="ReplyFromHome"
              component={ReplyFromHome}
              options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="Logout" component={Logout} />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </UnreadMessagesProvider>
  );
};

export default App;
