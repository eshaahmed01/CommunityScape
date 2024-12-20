import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import React, { useState, useEffect } from "react";
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import BackButton from "../components/BackButtons";
import PropertyDetail from "./PropertyDetail";
import { useRoute } from "@react-navigation/native";
const ImgPath = "../assets/images/Home/";


const Estates = ({ navigation }) => {
  const [estates, setEstates] = useState([]);
  const route = useRoute();

  const isBuyer = route?.params?.isBuyer ?? null;

  //fectching data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Estates"));
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if(isBuyer) {
          setEstates(docsArray?.filter((estate)=> !estate?.isSold ));
        } else {
          setEstates(docsArray);
        }
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };

    fetchDocuments();
  }, []);

  //styling for estates
  const FeaturedCard = ({ data }) => {
    const splitLocation = (location) => {
      const words = location.split(' ');
      const lastWord = words.pop();
      const remainingText = words.join(' ');

      return { remainingText, lastWord };
    };

    const { remainingText, lastWord } = splitLocation(data.Name);


    return (
      <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} onPress={() => navigation.navigate('PropertyDetail', { id: data.id, location: data.Location, name: data.Name })}>
        <Image
          source={{ uri: data.ImageURL }}
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
            style={{ marginTop: 4 }}
          >
            {remainingText}
          </FText>

          <View style={styles.featuretextView}>
            <FText
              fontSize="medium"
              fontWeight="700"
              color={colours.typography_80}
              style={{ marginLeft: -10 }}


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
    )
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View>
        <BackButton> </BackButton>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 60 }} >
            Featured Estates
          </FText>
        </View>

        <View
          style={{ flexDirection: "column", marginTop: 40, marginLeft: 20, }}
        >

          {estates.length === 0 ? (
            <Text>Loading...</Text>
          ) : (
            estates.map(estate => (
              <FeaturedCard key={estate.id} data={estate} />
            ))
          )}

        </View>

      </View>
    </ScrollView>




  )




}

export default Estates;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.secondary

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