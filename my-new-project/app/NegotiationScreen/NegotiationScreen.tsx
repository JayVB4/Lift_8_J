import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../utils/supabase";

const NegotiationScreen = () => {
  const {
    truck_id,
    estimated_price,
    kgToBook,
    pickup,
    dropoff,
    distance,
    truck_name,
    image,
  } = useLocalSearchParams();

  const [offerPrice, setOfferPrice] = useState("");

  const handleNegotiation = async () => {
    const offer = parseFloat(offerPrice);
    const estimated = parseFloat(estimated_price as string);
    const cargoWeight = parseFloat(kgToBook as string);
    const tripDistance = parseFloat(distance as string);

    if (isNaN(offer) || offer <= 0) {
      return Alert.alert("Invalid Offer", "Please enter a valid offer.");
    }

    if (isNaN(estimated)) {
      console.log("Estimated Price from Params:", estimated_price);
      return Alert.alert("Error", "Estimated price is missing or invalid.");
    }

    if (isNaN(cargoWeight) || isNaN(tripDistance)) {
      return Alert.alert("Error", "Cargo weight or distance is invalid.");
    }

    // Fetch truck details
    const { data: truck, error: truckError } = await supabase
      .from("trucks")
      .select("capacity_kg, filled_capacity")
      .eq("truck_id", truck_id)
      .single();

    if (truckError || !truck) {
      return Alert.alert("Error", "Truck details not found.");
    }

    const { capacity_kg, filled_capacity } = truck;

    if (filled_capacity + cargoWeight > capacity_kg) {
      return Alert.alert("Error", "Truck cannot carry this much weight.");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Alert.alert("Error", "User not logged in.");
    }

    const dealerAccepts = Math.random() < 0.5;
    const finalPrice = dealerAccepts ? offer : estimated;

    // Insert booking
    const { error: insertError } = await supabase.from("bookings").insert([
      {
        user_id: user.id,
        truck_id,
        pickup_location: pickup,
        dropoff_location: dropoff,
        distance_km: tripDistance,
        cargo_weight: cargoWeight,
        estimated_price: estimated,
        final_price: finalPrice,
        status: "pending",
      },
    ]);

    if (insertError) {
      console.error(insertError);
      return Alert.alert("Error", "Booking failed.");
    }

    // Update truck capacity
    const { error: updateError } = await supabase
      .from("trucks")
      .update({ filled_capacity: filled_capacity + cargoWeight })
      .eq("truck_id", truck_id);

    if (updateError) {
      console.error(updateError);
      return Alert.alert("Error", "Failed to update truck capacity.");
    }

    Alert.alert(
      dealerAccepts ? "🎉 Offer Accepted!" : "❌ Offer Rejected",
      `Final Price: ₹${finalPrice}`
    );
    router.push("/MapScreen/MapScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Truck: {truck_name}</Text>
      <Text style={styles.label}>
        Original Estimate: ₹{estimated_price || "N/A"}
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your offer"
        value={offerPrice}
        onChangeText={setOfferPrice}
      />

      <TouchableOpacity style={styles.button} onPress={handleNegotiation}>
        <Text style={styles.buttonText}>Send Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NegotiationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fefefe",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#5078F2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
