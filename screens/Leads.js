import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, TextInput, FlatList } from 'react-native';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import FText from '../components/Ftext';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import { useEffect } from 'react';
import BackButton from '../components/BackButtons';


const LeadData = [
    {
        name: 'Esha Ahmed Abbasi',
        phone : '718 650 3737',
        email : 'eshaabbasi234@gmail.com',
        message: 'I am interested in this property'
    },
    {
        name: 'Esha Ahmed Abbasi',
        phone : '718 650 3737',
        email : 'eshaabbasi234@gmail.com',
        message: 'I am interested in this property'
    }

]

const FeaturedCard = ({ data }) => {
    
    return (
      <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} >
        <View style={{flexDirection: 'column'}}> 
            <View> 
          <FText
            fontSize="medium"
            fontWeight="700"
            color={colours.typography_80}
            style={{ marginTop: 4, marginRight: 10 }}
          >
            {data.name} 
            
          </FText>
          </View>

          
           <View style={{marginTop: 5}}> 
            <FText
              fontSize="medium"
              fontWeight="700"
              color={colours.typography_80}
           
            >
              {data.phone}
            </FText>
            </View>

            <View style={{marginTop: 5}}> 
            <FText
              fontSize="medium"
              fontWeight="700"
              color={colours.typography_80}
              
            >
              {data.email}
            </FText>
            </View>

        <View style={{marginTop: 5}}> 
            <FText
              fontSize="medium"
              fontWeight="700"
              color={colours.typography_80}
            
            >
              Message: 
            </FText>
            <FText
              fontSize="medium"
              fontWeight={400}
              color={colours.typography_80}
            
            >
              {data.message} 
            </FText>

            </View>
            </View>

            
      </TouchableOpacity>
    )
  };

const Leads = () => {
    return (
        <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Property Leads
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{ marginTop: 2, marginLeft: 30 }}>
          Here are the following leads for your selected property
        </FText>
        </View>

        <FlatList
                data={LeadData}
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
                renderItem={({ item }) => <FeaturedCard data={item} />} // Render each lead using FeaturedCard
                contentContainerStyle={{ paddingHorizontal: 30, marginTop: 20 }}
            />

        
        </ScrollView>
    )
}

export default Leads;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    featuredCard: {
        width: 300,
        height: 180,
        backgroundColor: "#F5F4F8",
        borderRadius: 20,
        marginTop: 20,
        marginRight: 20,
        padding: 20
      }
})