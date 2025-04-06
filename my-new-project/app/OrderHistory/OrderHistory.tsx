// components/OrderHistory.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { supabase } from "../../utils/supabase";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "completed");

      if (!error && data) {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#5078F2" />;

  if (orders.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No past orders.
      </Text>
    );
  }

  return (
    <ScrollView>
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <Text style={styles.title}>Booking ID: {order.id}</Text>

          <Text>Pickup: {order.pickup_location}</Text>
          <Text>Dropoff: {order.dropoff_location}</Text>
          <Text>Weight: {order.cargo_weight} kg</Text>
          <Text>Distance: {order.distance_km} km</Text>
          <Text>Final Price: ₹{order.final_price}</Text>
          <Text>Status: {order.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
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
    color: "green",
  },
});
