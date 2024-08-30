import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";

const { width: windowWidth } = Dimensions.get("window");
const BUTTON_WIDTH = 120;
const BUTTON_HEIGHT = 50;
const SWIPE_THRESHOLD = 100;
const MAX_X = windowWidth * 0.8 - BUTTON_WIDTH - 10;

const CustomSlider = ({ onSwipe }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = Math.max(0, Math.min(MAX_X, gestureState.dx));
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.spring(pan, {
            toValue: { x: MAX_X, y: 0 },
            useNativeDriver: false,
            friction: 7,
            tension: 40,
          }).start(() => {
            if (onSwipe) {
              onSwipe();
            }

            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              friction: 7,
              tension: 40,
              delay: 500,
            }).start();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 7,
            tension: 40,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={{ width: windowWidth * 0.8 }}>
      <View
        style={{
          height: 60,
          borderRadius: 50,
          padding: 5,
          justifyContent: "center",
          backgroundColor: "#075856",
        }}
      >
        <Animated.Image
          source={require("../assets/arrows.png")}
          style={{
            justifyContent: "center",
            height: "30%",
            width: "30%",
            marginLeft: "50%",
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
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Explore Now
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(CustomSlider);
