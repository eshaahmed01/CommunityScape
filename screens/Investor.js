import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ImgPath = "../assets/images/Home/";

const Investor = () => {

const navigation = useNavigation();

    return (
        <ScrollView style={styles.mainContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
        <Image
        source={require(ImgPath + "Ellipse.png")}
        />
         <Image
         style={{width: 150, height: 200, tintColor: colours.primary}}
         
        source={require(ImgPath + "Ellipse2.png")}
        />
        </View>

      <View style={{alignItems: 'center'}}>
        <FText fontSize="h4" fontWeight={700} color={colours.primary} style={{ marginTop: -20 }}>
          Welcome to Investor
          
        </FText>
        <FText fontSize="h4" fontWeight={700} color={colours.primary}  >
          Dashboard 
        </FText>
        <FText fontSize="large" fontWeight={400} color={colours.primary} style={{marginTop: 10}}  >
          Find the best properties to invest into! 
        </FText>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InvestorProfile')} >
        <FText fontSize='large' fontWeight={700} color={colours.white}> 
           Let's Get Started
        </FText>
         </TouchableOpacity>


        </View>
        </ScrollView>
    )

}

export default Investor;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    halfCircle: {
        width: width * 1.5, // Making it larger than the screen width to get the desired effect
        height: width * 0.75, // Half of the width for a semi-circle
        borderBottomLeftRadius: width * 0.75, // Making it a half-circle
        borderBottomRightRadius: width * 0.75,
        backgroundColor: '#234F68', // Adjust to match your design
        position: 'absolute',
        top: -width * 0.4, // Adjust the position to match the design
        left: -width * 0.25, // Center it horizontally
    },
    button: {
        backgroundColor: '#8BC83F',
         height: 50,
         width: '70%',
         marginTop: 80,
         alignItems: 'center',
         justifyContent: 'center',
         borderRadius: 10,
         marginBottom: 20,
         alignSelf: 'center'
      }
})