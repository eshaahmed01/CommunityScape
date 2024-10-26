import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Chicago from '../assets/images/Chicago.jpeg';
import FText from './Ftext';
import { colours } from '../constants/colours';
import { useNavigation } from '@react-navigation/native';


const LocationTile = ({location, onPress}) => {

    // const navigation = useNavigation();

    // const handlePress = () => {
    //   navigation.navigate('LocationDetails');
    // };


        return (
          <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <Image source={location.image} style={styles.image} />
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{`#${location.number}`}</Text>
            </View>
            <FText  color= {colours.typography_60} fontSize= "small" fontWeight="400" style={styles.locationName}>{location.name}</FText>
          </TouchableOpacity>
        );
      };

      export default LocationTile;

      const styles = StyleSheet.create({
        itemContainer: {
          flex: 1,
          margin: 8,
          backgroundColor: '#E8E8E8',
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
          elevation: 3, // for Android shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          
          
        
        },
        image: {
          width: '90%',
          height: 150,
          borderRadius: 20
        },
        numberBadge: {
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: '#7DCE82',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        numberText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
        },
        locationName: {
          marginVertical: 8,
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginLeft:-30
        },
      });
      
  

