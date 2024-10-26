import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { colours } from '../constants/colours';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import FText from './Ftext';


const Buttons = ({ titleprop, isPressed, onPress  }) => {
    


  return (
    <View style={styles.buttonContainer}>
         <TouchableOpacity
        style={isPressed ? styles.buttonIsActive : styles.buttonStyle}
        onPress={onPress}
      >
         <FText color= { isPressed? "white" : colours.typography_60 } fontSize="normal" > {titleprop} </FText>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  buttonStyle: {
    marginLeft: 20,
    color: colours.typography_60,
    backgroundColor: '#E8E8E8', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    fontSize: 16, 
  },

  buttonIsActive : {

    backgroundColor: "#234F68",
    color: "white",
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    fontSize: 16, 
    marginLeft: 20,
    
  },
  buttonText: {
    color: colours.typography_60,
    fontSize: 16,

  },
});

export default Buttons;