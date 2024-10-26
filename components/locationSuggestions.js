import React from 'react';
import { View, Image, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FText from './Ftext';
import Icon from 'react-native-vector-icons/AntDesign';
import { colours } from '../constants/colours';
import { useNavigation } from '@react-navigation/native';


const LocationSuggestion = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('TopLocations');
  };
  return (
    <View style={{flexDirection: 'row'}}> 
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/images/location2.jpeg')} // Replace with your image path
          style={styles.image}
          resizeMode="cover"
        />
      
      
      </View>
      <FText  color="white" fontWeight={900} fontSize='h5' style={styles.text} > Get Location Suggestions </FText>
      <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}> 
      <Icon name="arrowright" size={30} color="white"/>
      </TouchableOpacity>
      
      </View>
  );
};

const styles = StyleSheet.create({
  
  imageWrapper: {
    marginTop: 30,
    width: "50%",
    alignItems: 'center',
    marginLeft: 90,
    position: 'relative'

  },
  image : {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 180

  },
  text :{
    position: 'absolute',
    top: 80,
    left: 20,
    fontWeight: 700

  },
  buttonContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 15,
    backgroundColor: colours.typography_60 , // Adjust background color as desired
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: 60,
    width: 150,
    borderTopRightRadius: 60
  },
  
});

export default LocationSuggestion;