import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const mockMessages = [
  { id: "1", text: "Hey, how are you?", sender: "Adam", timestamp: "10:30 AM" },
  { id: "2", text: "I am good, thanks!", sender: "You", timestamp: "10:32 AM" },
  {
    id: "3",
    text: "Can you give me an article on 10 lines about React Native?",
    sender: "Adam",
    timestamp: "10:35 AM",
  },
  {
    id: "4",
    text: "Yes Sure! here it is",
    sender: "You",
    timestamp: "10:40 AM",
  },
  {
    id: "5",
    text: `React Native is a framework for building mobile applications using JavaScript and React.
It allows developers to create apps for both iOS and Android from a single codebase.
The framework uses native components and bridges JavaScript and native code for optimal performance.
React Native enables hot reloading, allowing developers to see changes instantly without restarting the app.
It offers a rich set of pre-built components like View, Text, and Button for rapid development.
State management is often handled using hooks or libraries like Redux or Context API.
Navigation can be implemented using libraries like React Navigation or React Native Navigation.
Styling in React Native is similar to CSS but uses a JavaScript style object syntax.
React Native supports integration with native modules, enabling access to device-specific features.
The community and ecosystem around React Native provide extensive third-party libraries and tools to enhance development.`,
    sender: "You",
    timestamp: "10:45 AM",
  },
  // Add more messages here
];

const ChatDetail = () => {
  const route = useRoute();
  const { chatName } = route.params; // Get chatName from route params

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{chatName}</Text>
      <FlatList
        data={mockMessages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "You" ? styles.messageYou : styles.messageOther,
            ]}
          >
            <Text
              style={[
                styles.messageSender,
                item.sender === "You"
                  ? styles.messageSenderYou
                  : styles.messageSenderOther,
              ]}
            >
              {item.sender}
            </Text>
            <Text
              style={[
                styles.messageText,
                item.sender === "You"
                  ? styles.messageTextYou
                  : styles.messageTextOther,
              ]}
            >
              {item.text}
            </Text>
            <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message" />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            /* Handle send message */
          }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  heading: {
    marginTop: "8%",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    marginBottom: 10, // Increased margin for better separation
    maxWidth: "80%",
    alignSelf: "flex-start",
    paddingTop: 15, // Added padding at the top to ensure sender's name is visible
  },
  messageYou: {
    backgroundColor: "#075856",
    alignSelf: "flex-end",
  },
  messageOther: {
    backgroundColor: "#f1f1f1",
  },
  messageSender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageSenderYou: {
    color: "#fff", // Sender's name color for "You"
  },
  messageSenderOther: {
    color: "#000", // Sender's name color for other senders
  },
  messageText: {
    fontSize: 16,
  },
  messageTextYou: {
    color: "#fff", // Sender's text color for "You"
  },
  messageTextOther: {
    color: "#000", // Text color for other senders
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#075856",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messageList: {
    flexGrow: 1,
  },
});

export default ChatDetail;
