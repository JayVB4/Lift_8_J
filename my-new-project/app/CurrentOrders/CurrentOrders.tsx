// components/CurrentOrders.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { supabase } from "../../utils/supabase";

const CurrentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user?.id)
          .eq("status", "pending");

        if (error) {
          console.error("Error fetching orders:", error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#5078F2" />;

  if (orders.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No current orders.
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <Text style={styles.title}>Booking ID: {order.id}</Text>
          <Text>Pickup: {order.pickup_location}</Text>
          <Text>Dropoff: {order.dropoff_location}</Text>
          <Text>Weight: {order.cargo_weight} kg</Text>
          <Text>Distance: {order.distance_km} km</Text>
          <Text>Estimated Price: ₹{order.estimated_price}</Text>
          <Text>Final Price: ₹{order.final_price}</Text>
          <Text>Status: {order.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CurrentOrders;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#5078F2",
  },
});
