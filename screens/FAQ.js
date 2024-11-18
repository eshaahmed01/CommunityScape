import { FlatList, ScrollView, TouchableOpacity, View, Image, StyleSheet, TextInput, ActivityIndicator, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";

import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import Icon from 'react-native-vector-icons/FontAwesome';
import fonts from "../constants/fonts";
import DropDownPicker from 'react-native-dropdown-picker';
import * as MailComposer from 'expo-mail-composer';
import Icon2 from 'react-native-vector-icons/FontAwesome6'
import Icons from 'react-native-vector-icons/AntDesign';
import { db, auth } from "../firebaseconfig"; // This is your Firestore config
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig'; // Adjust the path as necessary
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const FAQ = () =>{

  const navigation = useNavigation();
    return (
        <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Frequently Asked Questions
        </FText>

         <View > 
        <FText fontSize="medium" fontWeight="400" color={colours.primary} style={{ marginTop: 10, marginLeft: 30, marginRight: 20 }}>
          Here are some of the questions answered for you in case you have an issue. 
        </FText>

        <FText fontSize="medium" fontWeight="700" color={colours.primary} style={{ marginTop: 10, marginLeft: 30, marginRight: 20 }}>
          OR 
        </FText>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChatBotScreen')}> 
          <FontAwesome5 name="robot" size={24} color={colours.secondary}> </FontAwesome5>
          
         <FText fontSize="medium" fontWeight="700" color={colours.secondary}> Try Chatbot </FText>
          </TouchableOpacity>
        </View>

       


        < View style ={styles.questionsCard}> 
        <FText fontSize="medium" fontWeight="700" color={colours.primary} style={{ marginTop: 10, marginLeft: 10, marginRight: 20 }}>
          What is Community Scape and how does it work?
        </FText>

        <FText fontSize="small" fontWeight="400" color={colours.primary} style={{ marginTop: 10, marginLeft: 10, marginRight: 20 }}>
          CommunityScape is a real estate platform that allows user to buy and sell their properties with advanced features under one platform.
        </FText>
        </View>


        < View style ={styles.questionsCard}> 
        <FText fontSize="medium" fontWeight="700" color={colours.primary} style={{ marginTop: 10, marginLeft: 10, marginRight: 20 }}>
          How can I create an account on Community Scape?
        </FText>

        <FText fontSize="small" fontWeight="400" color={colours.primary} style={{ marginTop: 10, marginLeft: 10, marginRight: 20 }}>
          CommunityScape is a real estate platform that allows user to buy and sell their properties with advanced features under one platform.
        </FText>
        </View>

      




        </View>
        </ScrollView>

    )
}
export default FAQ;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },

    questionsCard: {
      marginLeft: 20,
      width: 320,
      height: 150,
      backgroundColor: "#F5F4F8",
      borderRadius: 20,
      marginTop: 20,
      marginRight: 20,
    },
    button: {
      flexDirection: 'row',
      backgroundColor: '#8BC83F',
      height: 50,
      width: '70%',
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      alignSelf: 'center'

      
    }
})

