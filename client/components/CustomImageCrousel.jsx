import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  Animated,
  Pressable,
} from "react-native";
import React from "react";

const data = [
  require("../assets/images/white.png"),
  require("../assets/images/white.png"),
  require("../assets/images/white.png"),
  require("../assets/images/white.png"),
  require("../assets/images/white.png"),
];

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;

export default function CustomImageCarousel() {
  const scrollX = new Animated.Value(0);

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [-width * 0.7, 0, width * 0.7],
            extrapolate: "clamp",
          });
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1.1, 1, 1.1],
            extrapolate: "clamp",
          });

          return (
            <View
              style={{
                width: width,
                alignItems: "center",
                justifyContent: "center",
                marginTop: height * 0.3,
              }}
            >
              <Animated.View
                style={{
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT,
                  overflow: "hidden",
                  alignItems: "center",
                  borderRadius: 20,
                  transform: [{ translateY: translateY }, { scale: scale }],
                }}
              >
                <Animated.Image
                  source={item}
                  style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    transform: [{ translateY: translateY }, { scale: scale }],
                  }}
                />
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY: translateY }, { scale: scale }],
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <View style={{ padding: "5%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: "#000",
                            fontSize: 27,
                            fontFamily: "Outfit_Medium",
                          }}
                        >
                          Anonymous
                        </Text>
                        <Text
                          style={{
                            color: "#000",
                            fontSize: 24,
                            fontFamily: "Outfit_Medium",
                          }}
                        >
                          10:30 PM
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: "#C9C9C9",
                            fontSize: 14,
                            fontFamily: "Outfit_Regular",
                          }}
                        >
                          The Number 1 Secret Of Success
                        </Text>
                        <Text
                          style={{
                            color: "#C9C9C9",
                            fontFamily: "Outfit_Medium",
                          }}
                        >
                          22.06.2022
                        </Text>
                      </View>
                    </View>
                    <Animated.View
                      style={{
                        height: "65%",
                        width: "90%",
                        backgroundColor: "#F0F0F1",
                        alignSelf: "center",
                        borderRadius: 24,
                        padding: "5%",
                      }}
                    >
                      <Text
                        style={{ fontSize: 27, fontFamily: "Outfit_Medium" }}
                      >
                        The 2024 Bugatti Mistral roadster is more than a
                        roofless Chiron, as we learned from...
                      </Text>
                    </Animated.View>
                  </View>
                </Animated.View>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}
