import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "../../utils/supabase";
import { useRouter } from "expo-router";

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<any>(null);
  const [truckList, setTruckList] = useState<any[]>([]);
  const [truckTypes, setTruckTypes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let locationSubscription: any = null;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (userLocation) => {
          setLocation(userLocation.coords);
        }
      );
    };

    const fetchTrucks = async () => {
      const { data } = await supabase.from("trucks").select("*");
      if (data) {
        setTruckList(data);
        const uniqueTypes = [...new Set(data.map((t) => t.type))];
        setTruckTypes(uniqueTypes);
      }
    };

    const fetchBookings = async () => {
      const { data } = await supabase.from("bookings").select("*");
      if (data) setBookings(data);
    };

    getLocation();
    fetchTrucks();
    fetchBookings();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Order List Button */}
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => router.push("/OrderList/OrderList")}
      >
        <Text style={styles.orderButtonText}>📋</Text>
      </TouchableOpacity>

      {/* Orders Horizontal Scroll */}
      <ScrollView horizontal style={styles.orderList}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.orderItem}>
            <Text style={styles.orderTitle}>{booking.pickup_location}</Text>
            <Text style={styles.orderSubtitle}>
              To: {booking.dropoff_location}
            </Text>
            <Text style={styles.orderSubtitle}>₹{booking.estimated_price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Map View */}
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />

          {truckList.map((truck) =>
            truck.latitude && truck.longitude ? (
              <Marker
                key={truck.id}
                coordinate={{
                  latitude: truck.latitude,
                  longitude: truck.longitude,
                }}
                title={truck.name}
                description={`Truck Type: ${truck.type}`}
              />
            ) : null
          )}
        </MapView>
      )}

      {/* Bottom Modal with Truck Types */}
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select Truck Type</Text>

        {truckTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.optionButton}
            onPress={() =>
              router.push({ pathname: "/TruckList/TruckList", params: { type } })
            }
          >
            <Text style={styles.optionText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  orderList: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 60, // space for order list button
    zIndex: 2,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    minWidth: 150,
    elevation: 3,
  },
  orderTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  orderSubtitle: {
    fontSize: 12,
    color: "#333",
  },
  orderButton: {
    position: "absolute",
    top: 40,
    right: 15,
    backgroundColor: "#5078F2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    width: "90%",
    backgroundColor: "#5078F2",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
