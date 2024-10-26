import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../components/BackButtons';
import FText, { FontWeights } from '../components/Ftext';
import { colours } from '../constants/colours';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import Search from './Search';
import SearchBar from '../components/search';
import house1 from '../assets/images/house2.jpg';
import PropertyTile from '../components/PropertyTile';
import Chicago from '../assets/images/Chicago.jpeg';
import Miami from '../assets/images/miami.jpeg';
import NewYork from '../assets/images/NewYork.jpeg';
import LasVegas from '../assets/images/LasVegas.jpeg';
import LA from '../assets/images/LA.jpeg';
import Washington from '../assets/images/Washington.jpeg';
import { useState, useEffect } from 'react';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";



const Houses = 
   [ {
    name: 'Flower Heaven house',
    image: house1,
    location: 'Upsate Chicago',
    rating: '4.7',
    price: "$370/month",
    category: 'House'
},

{
    name: 'Flower Heaven house',
    image: house1,
    location: 'Upsate Chicago',
    rating: '4.7',
    price: "$370/month",
    category: 'House'
},

{
    name: 'Flower Heaven house',
    image: house1,
    location: 'Upsate Chicago',
    rating: '4.7',
    price: "$370/month",
    category: 'House'
},

]




const LocationDetails =  ({route,naviagtion}) => {
    const {name,num,image}=route.params

    const ImgPath = (name) => {
        switch (name) {
            case 'Chicago':
                return Chicago;
            case 'Miami':
                return Miami;
            case 'New York':
                return NewYork;
            case 'Las Vegas':
                return LasVegas;
            case 'Los Angeles':
                return LA;
            case 'Washington':
                return Washington;
            default:
                return Chicago;
        }
    }

    const [estates, setEstates] = useState([]);
  const [ otherEstates, setOtherEstates] = useState([]);
  const [combinedEstates, setCombinedEstates] = useState([]);
  const [filteredEstates, setFilteredEstates] = useState([]);
  const [filteredEstatesCount, setFilteredEstatesCount] = useState(0);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const q = query(collection(db, "Estates"))
        const querySnapshot = await getDocs(q);
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched Documents:", docsArray);
        setEstates(docsArray);
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };

    fetchDocuments();
  }, []);

useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const q = query(collection(db, "OtherEstates"))
        const querySnapshot = await getDocs(q);
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched Documents:", docsArray);
        setOtherEstates(docsArray);
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };
  
    fetchDocuments();
  }, []);

  useEffect(() => {
    const combined = [...estates, ...otherEstates];
    console.log('Combined Estates: ', combined)
    setCombinedEstates(combined);
  }, [estates, otherEstates]);

  Newname = name.replace(/,/g, '');

  useEffect(() => {
    const filtered = combinedEstates.filter(estate => estate.State === Newname);
    setFilteredEstates(filtered);
    setFilteredEstatesCount(filtered.length);
  }, [combinedEstates, name]);
    return(
        <ScrollView style={styles.container}>
        <BackButton />
        <View>
            <Image style ={styles.image} source={ImgPath(name)}/>
        </View>

        <FText color={colours.typography_60} fontSize='h4' fontWeight="900" style={styles.heading} > {name} </FText>
        <FText color={colours.typography_60} fontSize='small'  style={styles.smallheading} > Our recommended real estate in {name}  </FText>
        <SearchBar> </SearchBar>
        <View style={{flexDirection: 'row'}}> 
        <FText color={colours.typography_60} fontSize='large' style={{marginLeft: 30, marginTop: 20}} > Found </FText>
        <FText color={colours.typography_60} fontSize='large' style={{ marginTop: 20, fontWeight: 700, marginLeft: -5}}  > {filteredEstatesCount} </FText>
        <FText color={colours.typography_60} fontSize='large' style={{ marginTop: 20, marginLeft: 1 }}>
        {filteredEstatesCount === 1 ? "Estate" : "Estates"} </FText>
        <View style={{marginTop: 50, marginLeft: -155, width: "90%", flexDirection: 'column'}}> 
        {filteredEstates.map(estate => (
                    <PropertyTile house={estate} />
                ))}
        </View>
        </View>
      </ScrollView>

    )

}
export default LocationDetails;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 15
       // Ensure enough padding to make space for the back button
    },

    image : {
        borderRadius: 40,
        height: 330,
        width: 370,
        marginLeft: 10,
        marginTop: 10
    },

    heading : {
        marginLeft: 20,
        marginTop: 20,
    },

    smallheading : {
        marginLeft: 25

    }

})