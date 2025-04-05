import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "../utils/supabase";  // Make sure you have your supabase instance properly initialized

const test: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]); // State to store the orders
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("Order")
      .select("*");

    if (error) {
      setError(error.message);
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5078F2" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Render each order item in the list
  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Order Name: {item.name}</Text>
      <Text style={styles.orderText}>Order Status: {item.status}</Text>
      {/* You can add more fields from your 'Order' table here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders List</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  orderContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default test;
