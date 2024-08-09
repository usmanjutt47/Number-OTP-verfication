import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const posts = [
  {
    id: "1",
    name: "Elon",
    time: "2 mins ago",
    content: "Just launched a new rocket!",
  },
  {
    id: "2",
    name: "Ronaldo",
    time: "5 mins ago",
    content: "Scored a hat-trick!",
  },
  {
    id: "3",
    name: "Camila",
    time: "10 mins ago",
    content: "New song release!",
  },
];

const FavoriteScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { zIndex: posts.length - index }]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: -40, // Overlapping effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default FavoriteScreen;
