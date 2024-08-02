import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const BUTTON_WIDTH = 126;
const BUTTON_HEIGHT = 50;
const SWIPE_THRESHOLD = 100;
const MAX_X = windowWidth * 0.9 - BUTTON_WIDTH - 10;
const MAX_Y = windowHeight * 0.9 - BUTTON_HEIGHT + 10;

const CustomSlider = ({ callback = () => console.log("Swipe callback") }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Restrict movement within bounds
        let newX = Math.max(0, Math.min(MAX_X, gestureState.dx));
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          callback();

          Animated.spring(pan, {
            toValue: { x: MAX_X, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Dynamically change text color based on pan.x
  const textColor = pan.x.interpolate({
    inputRange: [0, MAX_X],
    outputRange: ["red", "green"],
  });

  return (
    <View style={{ marginTop: 40, width: windowWidth * 0.9 }}>
      <View
        style={{
          height: 60,
          borderRadius: 50,
          borderWidth: 1,
          padding: 5,
          justifyContent: "center",
          backgroundColor: "#075856",
        }}
      >
        <Animated.Image
          source={require("../assets/arrows.png")} // Import your image here
          style={{
            justifyContent: "center",
            // Position image at the top of the slider
            height: 10, // Adjust height as needed
            width: 70,
            marginLeft: "70%",
            // Adjust width as needed
          }}
        />
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 5,
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              width: BUTTON_WIDTH,
              height: BUTTON_HEIGHT,
              borderRadius: 50,
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontFamily: "Outfit_Medium",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Send Now
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(CustomSlider);
