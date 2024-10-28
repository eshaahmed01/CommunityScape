import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import FText from '../components/Ftext';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import { useEffect } from 'react';
import BackButton from '../components/BackButtons';
import { useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const FeaturedCard = ({ data }) => {

  return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} >
      <View style={{ flexDirection: 'column' }}>
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


        <View style={{ marginTop: 5 }}>
          <FText
            fontSize="medium"
            fontWeight="700"
            color={colours.typography_80}

          >
            {data.phone}
          </FText>
        </View>

        <View style={{ marginTop: 5 }}>
          <FText
            fontSize="medium"
            fontWeight="700"
            color={colours.typography_80}

          >
            {data.email}
          </FText>
        </View>

        <View style={{ marginTop: 5 }}>
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
  const route = useRoute();
  const estateId = route?.params?.id;
  const [leads, setLeads] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      setLoader(true);
      const leadsRef = collection(db, "Estates", estateId, "Leads");
      const allLeads = await getDocs(leadsRef);
      const leadsData = allLeads.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoader(false);
    }
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{ flex: 1 }} >
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Property Leads
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{ marginTop: 2, marginLeft: 30 }}>
          Here are the following leads for your selected property
        </FText>
      </View>

      {
        loader ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colours.primary} size={'large'} style={{bottom:40}} />
        </View>
          : leads?.length > 0 ? <FlatList
            data={leads}
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item }) => <FeaturedCard data={item} />} 
            contentContainerStyle={{ paddingHorizontal: 30, marginTop: 20 }}
          /> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView source={require('../assets/animations/empty_animation.json')} style={{ height:200, width:200, bottom:40 }} autoPlay loop />
          </View>
      }


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