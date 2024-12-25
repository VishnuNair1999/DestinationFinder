// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.instructionText}>Click here to start</Text>
      <Button title="Start" onPress={handleStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  instructionText: { fontSize: 18, marginBottom: 20 },
});

export default WelcomeScreen;
