import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  Animated,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;

export default function CustomImageCarousel() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get(
          "http://192.168.100.6:8080/api/v1/auth/letters"
        );
        if (response.data.success) {
          setLetters(response.data.letters);
        } else {
          setError("Failed to fetch letters.");
        }
      } catch (error) {
        setError("An error occurred while fetching letters.");
        console.log("Fetched letters:", response.data.letters);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />
    );
  }

  if (error) {
    return <Text style={styles.centered}>{error}</Text>;
  }

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
        data={letters}
        keyExtractor={(item) => item._id}
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
                  source={{ uri: item.content }}
                  style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    backgroundColor: "#fff",
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
                        {item.content}
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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
