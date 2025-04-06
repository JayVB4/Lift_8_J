import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CurrentOrders from "../CurrentOrders/CurrentOrders";
import OrderHistory from "../OrderHistory/OrderHistory";

const OrderList = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "current" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeText,
            ]}
          >
            Current Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "history" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeText,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentBox}>
        {activeTab === "current" ? <CurrentOrders /> : <OrderHistory />}
      </View>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#5078F2",
  },
  tabText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
  contentBox: {
    padding: 20,
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
  },
});
