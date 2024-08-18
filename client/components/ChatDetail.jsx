import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const ChatDetail = () => {
  const route = useRoute();
  const { chatId, chatContent, senderName, timestamp } = route.params;

  const messages = [
    {
      id: chatId,
      text: chatContent,
      sender: senderName,
      timestamp: timestamp,
    },
  ];

  return (
    <View style={styles.container}>
      <View>
        <Pressable></Pressable>
        <Text style={styles.heading}>Chat Details</Text>
      </View>
      <FlatList
        data={messages}
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 20,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderRadius: 28,
            backgroundColor: "#FEFEFE",
            elevation: 1,
            height: 55,
            paddingLeft: 10,
          }}
          placeholder="Type a message"
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 15, // Adjust this value to position the image
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icons/send.png")} // Replace with your image path
            style={{
              width: 24,
              height: 24,
            }}
          />
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
    borderBottomLeftRadius: 0,
    marginBottom: 10,
    maxWidth: "80%",
    alignSelf: "flex-start",
    paddingTop: 15,
    elevation: 3,
    backgroundColor: "#FEFEFE",
    marginLeft: 5,
    flexDirection: "column", // Ensure the timestamp is below the text
  },
  messageYou: {
    backgroundColor: "#075856",
    alignSelf: "flex-end",
  },
  messageOther: {
    elevation: 2,
    backgroundColor: "#FEFEFE",
  },
  messageSender: {
    fontFamily: "Outfit_Bold",
    marginBottom: 5,
    color: "#075856",
  },
  messageSenderYou: {
    color: "#fff",
  },
  messageSenderOther: {
    color: "#075856",
    fontSize: 16,
    fontFamily: "Outfit_Bold",
  },
  messageText: {
    fontSize: 16,
  },
  messageTextYou: {
    color: "#fff",
  },
  messageTextOther: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Outfit_Regular",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end", // Ensure it aligns well in message container
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "7%",
  },
  input: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: "#FEFEFE",
    elevation: 1,
    height: 55,
    paddingLeft: 10,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
    position: "absolute",
    bottom: 60, // Adjust based on your timestamp container's height
    width: "100%",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  imageButton: {
    padding: 5,
    marginRight: 10,
  },
  image: {
    width: 24,
    height: 24,
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
  timestampContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
});

export default ChatDetail;
