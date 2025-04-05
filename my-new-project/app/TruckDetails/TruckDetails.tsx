import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../utils/supabase";

const TruckDetails: React.FC = () => {
  const {
    truck_id,
    truck_name,
    owner_name,
    phone_number,
    capacity_kg,
    filled_capacity,
    base_price,
    price_per_km,
    price_per_kg,
    image,
  } = useLocalSearchParams();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState("");
  const [kgToBook, setKgToBook] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const total = Number(capacity_kg);
  const filled = Number(filled_capacity) || 0;
  const remaining = total - filled;

  const calculateEstimation = () => {
    if (!pickup || !dropoff || !distance || !kgToBook) {
      return Alert.alert("Missing Fields", "Please fill all booking inputs.");
    }

    const dist = parseFloat(distance);
    const cargo = parseFloat(kgToBook);

    if (isNaN(dist) || isNaN(cargo) || cargo <= 0 || cargo > remaining) {
      return Alert.alert(
        "Invalid Inputs",
        `Enter valid values. Max weight: ${remaining}kg.`
      );
    }

    const estimate =
      parseFloat(Array.isArray(base_price) ? base_price[0] : base_price) +
      dist *
        parseFloat(
          Array.isArray(price_per_km) ? price_per_km[0] : price_per_km
        ) +
      cargo *
        parseFloat(
          Array.isArray(price_per_kg) ? price_per_kg[0] : price_per_kg
        );

    setEstimatedPrice(Math.round(estimate));
  };

  const handleBooking = async () => {
    if (!estimatedPrice) return;

    // Fetch current truck details
    const { data: truck, error: truckError } = await supabase
      .from("trucks")
      .select("capacity_kg, filled_capacity")
      .eq("truck_id", truck_id)
      .single();

    if (truckError || !truck) {
      return Alert.alert("Error", "Truck details not found.");
    }

    const { capacity_kg, filled_capacity } = truck;
    const cargoWeight = parseFloat(kgToBook);

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
    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user.id, // Replace later with real user ID
        truck_id: truck_id,
        pickup_location: pickup,
        dropoff_location: dropoff,
        distance_km: parseFloat(distance),
        cargo_weight: parseFloat(kgToBook),
        estimated_price: estimatedPrice,
        status: "pending", // 👈 CASE-SENSITIVE!
        final_price: estimatedPrice,
      },
    ]);

    if (error) {
      console.error(error);
      return Alert.alert("Error", "Booking failed.");
    }
  // Update truck's filled capacity
  const { error: updateError } = await supabase
    .from("trucks")
    .update({ filled_capacity: filled_capacity + cargoWeight })
    .eq("truck_id", truck_id);

  if (updateError) {
    console.error(updateError);
    return Alert.alert("Error", "Failed to update truck capacity.");
  }
    Alert.alert("Success", "Booking confirmed.");
    router.push("/MapScreen/MapScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: image as string }} style={styles.image} />

      <Text style={styles.name}>{truck_name}</Text>
      <Text style={styles.label}>
        Owner: <Text style={styles.value}>{owner_name}</Text>
      </Text>
      <Text style={styles.label}>
        📞 <Text style={styles.value}>{phone_number}</Text>
      </Text>
      <Text style={styles.label}>
        Capacity:{" "}
        <Text style={styles.value}>
          {filled}kg / {capacity_kg}kg
        </Text>
      </Text>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(filled / total) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.label}>
        Price:{" "}
        <Text style={styles.value}>
          ₹{base_price} + ₹{price_per_km}/km + ₹{price_per_kg}/kg
        </Text>
      </Text>

      {/* Booking Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
      />
      <TextInput
        style={styles.input}
        placeholder="Dropoff Location"
        value={dropoff}
        onChangeText={setDropoff}
      />
      <TextInput
        style={styles.input}
        placeholder="Distance (in km)"
        keyboardType="numeric"
        value={distance}
        onChangeText={setDistance}
      />
      <TextInput
        style={styles.input}
        placeholder={`Cargo Weight (max ${remaining}kg)`}
        keyboardType="numeric"
        value={kgToBook}
        onChangeText={setKgToBook}
      />

      {/* Get Estimation Button */}
      <TouchableOpacity style={styles.button} onPress={calculateEstimation}>
        <Text style={styles.buttonText}>Get Estimation</Text>
      </TouchableOpacity>

      {/* Show estimation & Confirm button */}
      {estimatedPrice !== null && (
        <>
          <Text style={styles.estimateText}>
            Estimated Price: ₹{estimatedPrice}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#28a745" }]}
            onPress={handleBooking}
          >
            <Text style={styles.buttonText}>Confirm Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={() =>
              router.push({
                pathname: "/NegotiationScreen/NegotiationScreen",
                params: {
                  truck_id: truck_id?.toString(),
                  truck_name: truck_name?.toString(),
                  pickup,
                  dropoff,
                  distance,
                  kgToBook,
                  estimated_price: estimatedPrice,
                },
              })
            }
          >
            <Text style={styles.buttonText}>Negotiate</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default TruckDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  image: {
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "cover",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontWeight: "600",
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#5078F2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  estimateText: {
    fontSize: 18,
    color: "#222",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "600",
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
});
