import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Font } from 'expo'



const LocationSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedLocation, selectedAddress } = route.params || {};

  const [region, setRegion] = useState({
    latitude: selectedLocation?.latitude || 37.78825,
    longitude: selectedLocation?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [address, setAddress] = useState(selectedAddress || 'Select location');

  useEffect(() => {
    if (selectedLocation) {
      setRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setAddress(selectedAddress);
    }
  }, [selectedLocation, selectedAddress]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add your location</Text>
      <Text style={styles.subHeaderText}>You can edit this later on your account setting.</Text>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={region => setRegion(region)}
      >
        <Marker coordinate={region} />
      </MapView>
      <TouchableOpacity style={styles.locationDetailButton} onPress={() => navigation.navigate('mapS')}>
        <Text style={styles.locationDetailButtonText}>{address}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Category')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#FFF',
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Lato",
    fontWeight: 'bold',
    fontFamily  :'Roboto',
    color: '#234F68',
    padding:20

  },
  subHeaderText: {
    width: 259,
    height: 22,
    fontSize: 18,
    fontWeight: "400",

    color: "#53587A",
    paddingLeft: 20,
  },
  map: {
    flex: 1,
    marginVertical: 20,
  },
  locationDetailButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#EEE',
    marginBottom: 20,
    alignItems: 'center',
  },
  locationDetailButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#8BC83F',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LocationSetupScreen;
