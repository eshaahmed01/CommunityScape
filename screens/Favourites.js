import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import BackButton from '../components/BackButtons';
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import { db } from "../firebaseconfig";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import useUserManager from '../hooks/useUserManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const ImgPath = "../assets/images/Home/";

const Favourites = () => {

  const navigation = useNavigation();
  const { currentUser } = useUserManager();

  const [mergedEstates, setMergedEstates] = useState([]);
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          setLoader(true);
          const favoriteEstates = await getFavorites(currentUser?.id);
          const estateDetails = await Promise.all(favoriteEstates?.map((fav) => getEstateDetails(fav?.estateId)));
          setMergedEstates(estateDetails?.filter((estate) => estate !== null));
        } catch (error) {
          console.error("Error fetching favorites: ", error);
        } finally {
          setLoader(false);
        }
      };

      fetchFavorites();
      return () => { setMergedEstates([]); setLoader(false) };
    }, [currentUser?.id])
  );

  const getEstateDetails = async (estateId) => {
    try {
      const estateRef = doc(db, "Estates", estateId);
      const estateSnap = await getDoc(estateRef);

      if (estateSnap.exists()) {
        return { id: estateId, ...estateSnap.data() };
      } else {
        console.error("Estate does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching estate details: ", error);
      return null;
    }
  };

  const getFavorites = async (userId) => {
    try {
      const favoritesRef = collection(db, "users", userId, "favorites");
      const snapshot = await getDocs(favoritesRef);

      const favorites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return favorites;
    } catch (error) {
      return [];
    }
  };

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
            style={{ marginTop: 7 }}
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
    <ScrollView style={{ flex: 1, backgroundColor: colours.secondary }} contentContainerStyle={{ flexGrow: 1 }} >
      <BackButton> </BackButton>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 25 }}>
        <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{ marginTop: 30 }}> Favourites </FText>
      </View>
      <View style={{ flex: 1, flexDirection: "column", marginTop: 39, alignItems: 'center' }}>
        {
          loader ? <View style={{flex:0.8, alignItems:'center', justifyContent:'center'}} >
            <FText>Loading...</FText>
          </View>
            : mergedEstates.length > 0 ?
              (
                mergedEstates?.map(estate => (
                  <FeaturedCard key={estate.id} data={estate} />
                ))
              ) :
              (
                <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }} >
                  <FText>No Favorites</FText>
                </View>
              )
        }

      </View>

    </ScrollView>
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



