import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BackButton from '../components/BackButtons';
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import { useState, useEffect } from 'react';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
const ImgPath = "../assets/images/Home/";

const Favourites = ({ route }) => {

  const location = route.params;

  console.log("Favourites location: ", location);

  const [estates, setEstates] = useState([]);
  const [ otherEstates, setOtherEstates] = useState([]);
  const [mergedEstates, setMergedEstates] = useState([]);

 
//Fetching Featured Estates
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, "Estates"), limit(3))
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Fetched featured Estates: ", estates);
      
      setEstates(docsArray);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  fetchDocuments();
}, []);

//fetching unfeatured data
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, "OtherEstates"))
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOtherEstates(docsArray);
      const merged = [...estates, ...otherEstates];
      console.log('Merged Estates are: ', merged);
      setMergedEstates(merged);

      const filteredEstates = merged.filter(estate => estate.Location === location);
            console.log("Filtered Estates:", filteredEstates);

            // Set the filtered estates to the state
            setMergedEstates(filteredEstates);


    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  fetchDocuments();
}, []);







const FeaturedCard = ({ data }) => {
  const splitLocation = (location) => {
    const words = location.split(' ');
    const lastWord = words.pop();
    const remainingText = words.join(' ');

    return { remainingText, lastWord };
  };

  const { remainingText, lastWord } = splitLocation(data.Name);


  return (
  <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} onPress={()=> navigation.navigate('PropertyDetail', { id: data.id, location: data.Location, name: data.Name })}>
    <Image
      source={{uri: data.ImageURL}}
      style={styles.featureImg}
    />
    
    <View style={styles.tagView}>
      <FText fontSize="small" fontWeight="400" color={colours.secondary}>
        {data.Type}
      </FText>
    </View>
    <View style={styles.featuretextView}>
      <FText
        fontSize="medium"
        fontWeight="700"
        color={colours.typography_80}
        style={{ marginTop: 7}}
      >
        {remainingText}
      </FText>

      <View style={styles.featuretextView}>
      <FText
        fontSize="medium"
        fontWeight="700"
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
          fontWeight="700"
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
          fontWeight="400"
          color={colours.typography_80}
        >
         {data.Location}
        </FText>
      </View>
      <FText
        fontSize="medium"
        fontWeight="700"
        color={colours.typography_80}
        style={{ marginTop: 10 }}
      >
       ${data.Price.toLocaleString()}{" "}
       
      </FText>
    </View>
  </TouchableOpacity>
)};






  return (
    <View style = {{backgroundColor: colours.secondary}}> 
      <BackButton> </BackButton>
      <View style={{justifyContent:'center', alignItems: 'center', width: '100%', marginTop: 25}}>  
      <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{marginTop: 30}}> Favourites </FText>
      </View>
      <View
            style={{ flexDirection: "column", marginTop: 39, marginLeft: 20,  }}
          >
            
            {mergedEstates.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
       mergedEstates.map(estate => (
          <FeaturedCard key={estate.id} data={estate} />
        ))
      )}
            
          </View>
      
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
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
    },
  
  
  
  })
 
  // Add more styles as needed



