import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomTopNav from "../components/CustomTopNav";
import { StatusBar } from "expo-status-bar";
import CustomImageCrousel from "../components/CustomImageCrousel";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function Home() {
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={{ padding: "5%", position: "absolute" }}>
        <CustomTopNav />
      </View>
      <CustomImageCrousel />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
