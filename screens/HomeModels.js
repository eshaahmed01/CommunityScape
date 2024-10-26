import { FlatList, ScrollView, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app, db } from '../firebaseconfig'; // Ensure correct import
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import Icon from 'react-native-vector-icons/FontAwesome';

const NearByCard = ({ data, navigation }) => (
  <TouchableOpacity style={styles.nearByView}>
    <TouchableOpacity style={styles.heartBtn} onPress={() => navigation.navigate('Camera')}>
      <Icon name="camera" size={30} color="#A1A5C1" />
    </TouchableOpacity>
    <Image
  source={{ uri: data.ImageURL }}  // Cloudinary URL fetched from Firestore
  style={styles.nearByImg}
/>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('CostEstimates', { modelId: data.id })}
    >
      <FText fontSize="large" fontWeight={900} color={colours.secondary}>
        View Cost Estimates
      </FText>
    </TouchableOpacity>
  </TouchableOpacity>
);

const HomeModels = ({ navigation }) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Models'));
        const modelList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Fetched model data:', data);  // Log fetched data
          return {
            id: doc.id,
            ...data,
          };
        });
        setModels(modelList);
      } catch (error) {
        console.error("Error fetching models: ", error);
      }
    };
    fetchModels();
  }, []);
  

  return (
    <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Home Models
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{ marginTop: 2, marginLeft: 30 }}>
          Please select your desired model to view in AR
        </FText>
      </View>
      <FlatList
        data={models}
        renderItem={({ item }) => <NearByCard data={item} navigation={navigation} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </ScrollView>
  );
};


export default HomeModels;


const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    heartBtn: {
        padding: 8,
        borderRadius: 10,
        position: 'absolute',
        top: '14%',
        right: 6,
        zIndex: 999,
    },
      nearByView: {
        width: "90%",
        height: 340,
        backgroundColor: "#F5F4F8",
        borderRadius: 20,
        marginTop: 20,
        marginLeft: 20
      },
      nearByImg: {
        width: "100%",
        height: "86%",
        alignSelf: "center",
        resizeMode: "contain"
      
      },
      button: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        backgroundColor: colours.primary,
        width: '80%',
        alignSelf: 'center'
        
    },

})