import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';

const LocationDetailScreen = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [address, setAddress] = useState('');

  const handleChooseLocation = () => {
    navigation.navigate('map', {
      selectedLocation: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      selectedAddress: address,
    });
  };


  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Find location"
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setAddress(data.description);
          }

        }}
        query={{
          key: 'AIzaSyCAWpLviql0x8UFSTeiWpda0ksNkaqfLDQ',
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: { flex: 0, position: 'absolute', width: '100%', zIndex: 1 },
          listView: { backgroundColor: 'white' },
        }}
      />
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={region => setRegion(region)}
      >
        <Marker coordinate={region} />
      </MapView>
      <View style={styles.locationDetail}>
        <Text style={styles.locationDetailText}>{address}</Text>
      </View>
      <TouchableOpacity style={styles.chooseButton} onPress={handleChooseLocation}>
        <Text style={styles.chooseButtonText}>Choose your location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    


  },
  map: {
    flex: 1,
  },
  locationDetail: {
    padding: 20,
    backgroundColor: 'white',
  },
  locationDetailText: {
    fontSize: 16,
  },
  chooseButton: {
    padding: 15,
    backgroundColor: '#A5D6A7',
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  chooseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LocationDetailScreen;
