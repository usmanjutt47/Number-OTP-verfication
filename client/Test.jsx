import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateLetterScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [content, setContent] = useState("");
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://192.168.100.175:8080/api/v1/letters"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setLetters(data.letters);
        } else {
          setError(data.message || "Failed to fetch letters.");
        }
      } catch (err) {
        setError("An error occurred while fetching letters.");
        console.error("Error fetching letters:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthenticatedUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setAuthenticatedUserId(userId);
      } catch (err) {
        console.error("Error fetching user ID from AsyncStorage:", err);
      }
    };

    fetchLetters();
    fetchAuthenticatedUserId();
  }, []);

  const requestOtp = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.175:8080/api/v1/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Success",
          "OTP sent successfully. Please check your email."
        );
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "An error occurred while sending OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.175:8080/api/v1/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("userId", data.userId);
        setAuthenticatedUserId(data.userId); // Update authenticated user ID
        Alert.alert("Success", "OTP verified successfully.");
      } else {
        Alert.alert("Error", data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "An error occurred while verifying OTP.");
    }
  };

  const createLetter = async () => {
    try {
      if (!authenticatedUserId) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      const response = await fetch(
        "http://192.168.100.175:8080/api/v1/create-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: authenticatedUserId, content }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Letter created successfully.");
        setContent("");
        // Refresh letters after creating a new one
        const fetchLetters = async () => {
          try {
            setLoading(true);
            const response = await fetch(
              "http://192.168.100.175:8080/api/v1/letters"
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
              setLetters(data.letters);
            } else {
              setError(data.message || "Failed to fetch letters.");
            }
          } catch (err) {
            setError("An error occurred while fetching letters.");
            console.error("Error fetching letters:", err);
          } finally {
            setLoading(false);
          }
        };

        fetchLetters();
      } else {
        Alert.alert("Error", data.message || "Failed to create letter.");
      }
    } catch (error) {
      console.error("Error creating letter:", error);
      Alert.alert("Error", "An error occurred while creating the letter.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Letter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Send OTP" onPress={requestOtp} />

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <Button title="Verify OTP" onPress={verifyOtp} />

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Enter your letter content here..."
        value={content}
        onChangeText={setContent}
      />
      <Button title="Submit Letter" onPress={createLetter} />

      <Text style={styles.title}>All Letters</Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.lettersContainer}>
          {letters.map((letter) => {
            // Ensure userId is not null and has the _id property
            const userIdString = letter.userId
              ? `User ID: ${letter.userId._id || "Not available"} (Email: ${
                  letter.userId.email || "Not available"
                })`
              : "User ID: Not available";

            // Check if the letter's userId matches the authenticated user's ID
            const isUserLetter =
              authenticatedUserId === (letter.userId?._id || null);

            return (
              <View
                key={letter._id}
                style={[
                  styles.letterCard,
                  { borderColor: isUserLetter ? "green" : "gray" },
                ]}
              >
                <Text style={styles.letterContent}>
                  {letter.content || "No content available"}
                </Text>
                <Text style={styles.letterInfo}>
                  Created at: {new Date(letter.createdAt).toLocaleString()}
                </Text>
                <Text style={styles.letterInfo}>{userIdString}</Text>
                <Text
                  style={[
                    styles.letterInfo,
                    { color: isUserLetter ? "green" : "red" },
                  ]}
                >
                  {isUserLetter
                    ? "This is your letter"
                    : "This is someone else's letter"}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  lettersContainer: {
    marginTop: 20,
  },
  letterCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  letterContent: {
    fontSize: 16,
    fontWeight: "bold",
  },
  letterInfo: {
    fontSize: 12,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
