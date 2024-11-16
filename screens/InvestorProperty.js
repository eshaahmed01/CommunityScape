
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButtons'
const ImgPath = "../assets/images/Home/";

const PropertyData = [
    {
        id: Date.now() + Math.floor(Math.random() * 10000),
        Name: 'Apartment',
        ImageURL: 'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        Type: 'Apartment',
        Rating: '4.8',
        Location: '990 Rookus Drive, Wayland MI',
        Price: 390000
    },
    {
        id: Date.now() + Math.floor(Math.random() * 10000),
        Name: 'Apartment',
        ImageURL: 'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        Type: 'Apartment',
        Rating: '4.8',
        Location: '990 Rookus Drive, Wayland MI',
        Price: 390000
    }
]

const FeaturedCard = ({ data }) => {
    const splitLocation = (location) => {
      const words = location.split(' ');
      const lastWord = words.pop();
      const remainingText = words.join(' ');
  
      return { remainingText, lastWord };
    };
  
    const { remainingText, lastWord } = splitLocation(data.Name);

    const [address, cityState] = data.Location.split(', ');

    return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} onPress={()=> navigation.navigate('PropertyDetail', { id: data.id, location: data.Location, name: data.Name })}>
      <Image
        source={{uri: data.ImageURL}}
        style={styles.featureImg}
      />
      
      <View style={styles.tagView}>
        <FText fontSize="small" fontWeight={400} color={colours.secondary}>
          {data.Type}
        </FText>
      </View>
      <View style={styles.featuretextView}>
        <FText
          fontSize="medium"
          fontWeight={700}
          color={colours.typography_80}
          style={{ marginTop: 4}}
        >
          {remainingText}
        </FText>

        <View style={styles.featuretextView}>
        <FText
          fontSize="medium"
          fontWeight={700}
          color={colours.typography_80}
          style={{ marginLeft: -10}}
          
          
        >
          {lastWord}
        </FText>
        </View>

        <View style={styles.ratingView}>
          <Image source={require(ImgPath + "star.png")} style={styles.rating} />
          <FText
            fontSize="small"
            fontWeight={700}
            color={colours.typography_80}
          >
            {data.Rating}
          </FText>
        </View>
        <View style={styles.locationView}>
          <Image
            source={require(ImgPath + "location.png")}
            style={styles.location}
          />
          <FText
            fontSize="medium"
            fontWeight={400}
            color={colours.typography_80}
           
          >
           {address}
          </FText>
        </View>
        <FText
            fontSize="medium"
            fontWeight={400}
            color={colours.typography_80}
            style={{marginTop: -12, marginLeft: 14}}
           
          >
           {cityState}
          </FText>
        <FText
          fontSize="medium"
          fontWeight={700}
          color={colours.typography_80}
          style={{ marginTop: 10 }}
        >
         ${data.Price.toLocaleString()}{" "}
         
        </FText>
      </View>
    </TouchableOpacity>
  )};

const InvestorProperty = () => {
  const navigation = useNavigation();

    return (
        <ScrollView style={styles.mainContainer}>
        
           
            <View style={styles.headerSection}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
                  source={require(ImgPath + "lines.png")}
                
                />
                </TouchableOpacity>
                </View>

                <FText fontSize="h6" fontWeight={700} color={colours.primary} style={{ marginTop: 30, marginLeft: 25 }}>
                  We found the following properties for you...
               </FText>

                <View
            style={{ flexDirection: "column", marginTop: 20, marginLeft: 20,  }}
          >
            
            {
        PropertyData.map(estate => (
          <FeaturedCard key={estate.id} data={estate} />
        ))
        }
      
         </View>
                </ScrollView>
    )

}

export default InvestorProperty;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:colours.secondary
    },

    headerSection: {
      marginLeft: 20,
      marginTop: 50

    },
    featuredCard: {
        width: 350,
        height: 180,
        backgroundColor: "#F5F4F8",
        borderRadius: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
      },
      featureImg: {
        width: 120,
        height: "88%",
        borderRadius: 20,
        resizeMode: "cover",
        marginLeft: 6,
      },
      tagView: {
        position: "absolute",
        bottom: 20,
        left: 12,
        backgroundColor: colours.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
      },
      ratingView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      },
      locationView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 18,
        flexWrap: 'wrap',
      },
      featuretextView: {
        alignItems: "flex-start",
        marginLeft: 10,
      },
      rating: {
        width: 14,
        height: 14,
        resizeMode: "contain",
      },
      location: {
        width: 14,
        height: 14,
        resizeMode: "contain",
      }
})






