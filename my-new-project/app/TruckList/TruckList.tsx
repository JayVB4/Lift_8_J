import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../utils/supabase';

const TruckList: React.FC = () => {
  const { type } = useLocalSearchParams();
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .eq('type', type)
        .eq('availability_status', true);

      if (data) setTrucks(data);
      if (error) console.error(error);
    };

    fetchTrucks();
  }, [type]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type} Available Vehicles</Text>

      <FlatList
        data={trucks}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `truck-${index}`)}
        renderItem={({ item }) => {
          const filled = item.filled_capacity || 0;
          const total = item.capacity_kg || 1000;
          const filledPercentage = Math.min((filled / total) * 100, 100);

          return (
            <View style={styles.truckItem}>
              <Image source={{ uri: item.image }} style={styles.truckImage} />
              <View style={styles.truckDetails}>
                <Text style={styles.truckName}>{item.truck_name}</Text>
                <Text style={styles.truckInfo}>Owner: {item.owner_name}</Text>
                <Text style={styles.truckInfo}>📞 {item.phone_number}</Text>
                <Text style={styles.truckInfo}>
                  Capacity: {filled}kg / {total}kg
                </Text>

                {/* Capacity progress bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBarFill, { width: `${filledPercentage}%` }]}
                  />
                </View>

                <Text style={styles.truckInfo}>
                  ₹{item.base_price} base | ₹{item.price_per_km}/km | ₹{item.price_per_kg}/kg
                </Text>

                <TouchableOpacity style={styles.bookButton}
                  onPress={() =>
                    router.push({
                      pathname: "/TruckDetails/TruckDetails",
                      params: { ...item },
                    })
                  }
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No trucks available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  truckItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    alignItems: 'flex-start',
    elevation: 2,
  },
  truckImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  truckDetails: {
    flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  truckInfo: {
    fontSize: 13,
    marginBottom: 2,
    color: '#444',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  bookButton: {
    marginTop: 6,
    backgroundColor: '#5078F2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});

export default TruckList;
