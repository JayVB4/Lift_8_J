import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LogoSVG from '../assets/images/logo.svg';
const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo and Image */}
      <View style={styles.imageContainer}>
        <Text style={styles.logo}>LIFT<Text style={styles.logoNumber}>8</Text></Text>
        {/* <Image source={require("../assets/images/splashScreen.svg")} style={styles.image} /> */}
        <LogoSVG />
      </View>

      {/* Title & Description */}
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Haul Smarter,{"\n"}Go Farther</Text>
        <Text style={styles.subtext}>On your terms, every mile</Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/Signup/Signup")}>
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 40,
  },
  imageContainer: {
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  logoNumber: {
    color: "#5078F2",
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    marginVertical: 20,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1C1C1E",
  },
  subtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#1C1C1E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
