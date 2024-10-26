import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Chicago from '../assets/images/Chicago.jpeg';
import FText from './Ftext';
import { colours } from '../constants/colours';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const PropertyTile  = ({house}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{uri: house.ImageURL}} // Replace with your image source
        style={styles.image}
      />
      
      <View style={styles.content}>
        <FText style={styles.title} color={colours.typography_60} fontSize='normal' >{house.Name}</FText>
        <View style={styles.row}>
          <Icon name="star" size={16} color="#FFD700" />
          <FText color={colours.typography_60} fontSize='normal' style={styles.rating}>{house.Rating}</FText>
        </View>
        <FText color={colours.typography_60} fontSize='normal' style={styles.location}>{house.Location}</FText>
        <FText color={colours.typography_60} fontSize='normal' style={styles.price}>${house.Price.toLocaleString()}{" "}</FText>
        <View style={styles.tag}>
          <FText color='white' fontSize='small' style={styles.tagText}>{house.Type}</FText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyTile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E4E2',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginVertical: 10,
    marginHorizontal: 0,
  },
  image: {
    width: '40%',
    height: 170,
    position: 'relative'

  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF5A5F',
    borderRadius: 15,
    padding: 5,
  },
  content: {
    padding: 10,
    width: '60%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    
  },
  location: {
    fontSize: 14,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  tag: {
    backgroundColor: colours.typography_60,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
    marginTop: 20,
    position: 'absolute',
    left: -130,
    bottom: 5



  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
});