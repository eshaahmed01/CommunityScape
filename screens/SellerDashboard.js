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
import React, { useState, useEffect, useCallback } from "react";
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import DropDownPicker from "react-native-dropdown-picker";
import { db, auth } from "../firebaseconfig"; // This is your Firestore config
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Import getAuth separately
import fonts from "../constants/fonts";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig'; // Adjust the path as necessary
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6'
import Icons from 'react-native-vector-icons/AntDesign';


const SellerDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValue, setDropdownValue] = useState("jakarta");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [estates, setEstates] = useState([]);
  const [otherEstates, setOtherEstates] = useState([]);
  const [filteredEstates, setFilteredEstates] = useState([]);
  const [otherfilteredEstates, setOtherfilteredEstates] = useState([]);
  const [architects, setArchitects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  const ImgPath = "../assets/images/Home/";
  const TabData = [
    "All",
    "House",
    "Apartment"
  ];

  const Locations = [
    {
      name: 'Chicago,IL',
      image: 'https://m.media-amazon.com/images/I/810vzeHwPrL._AC_SX679_.jpg'
    },

    {
      name: 'Washington,DC',
      image: 'https://www.theneedlepointer.com/stores/npoint/images/o/w/PHCS-12/PHCS-12.jpg'
    },

    {
      name: 'Phoenix,AZ',
      image: 'https://render.fineartamerica.com/images/rendered/default/metal-print/8/6.5/break/images/artworkimages/medium/3/rachels-knoll-sedona-arizona-view-anthony-giammarino.jpg'
    },

    {
      name: 'Detroit,MI',
      image: 'https://m.media-amazon.com/images/I/71dP8es05wL._AC_SX679_.jpg'
    },
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Show loading indicator
      try {
        const user = auth.currentUser; // Access currentUser directly

        if (user) {
          const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));

          if (!userDoc.empty) {
            const data = userDoc.docs[0].data();  // Assuming the email is unique

            setUserData({
              fullName: data.fullName || 'No Name',
              profilePic: data.profilePic || '',
            });
          } else {
            console.log('No user document found!');
          }
        } else {
          console.log('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Hide the loading indicator once data is fetched
      }
    };

    fetchUserData(); // Call the function
  }, []);

  // Run once on component mount // Run once on component mount
  // fetching Architects Data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const q = query(collection(db, "Architects"), limit(3))
        const querySnapshot = await getDocs(q);
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // console.log("Fetched Documents:", docsArray);
        setArchitects(docsArray);
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };

    fetchDocuments();
  }, []);



  //Fetching Featured Estates
  useFocusEffect(
    useCallback(()=>{
      const fetchDocuments = async () => {
        try {
          const q = query(collection(db, "Estates"))
          const querySnapshot = await getDocs(q);
          const docsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // console.log("Fetched Documents:", docsArray);
          setEstates(docsArray);
        } catch (e) {
          console.error("Error getting documents: ", e);
        }
      };
  
      fetchDocuments();
    },[])
  )
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       const q = query(collection(db, "Estates"))
  //       const querySnapshot = await getDocs(q);
  //       const docsArray = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       // console.log("Fetched Documents:", docsArray);
  //       setEstates(docsArray);
  //     } catch (e) {
  //       console.error("Error getting documents: ", e);
  //     }
  //   };

  //   fetchDocuments();
  // }, []);


  // **New useEffect to filter estates based on activeTab**
  useEffect(() => {
    if (activeTab === 0) {
      setFilteredEstates(estates?.slice(0,3));
      setOtherfilteredEstates(otherEstates);
    } else if (activeTab === 1) {
      setFilteredEstates(estates.filter(estate => estate.Type === "House")?.slice(0,3));
      setOtherfilteredEstates(otherEstates.filter(estate => estate.Type === "House"));
    } else if (activeTab === 2) {
      setFilteredEstates(estates.filter(estate => estate.Type === "Apartment")?.slice(0,3));
      setOtherfilteredEstates(otherEstates.filter(estate => estate.Type === "Apartment"));
    }
  }, [activeTab, estates]);


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
        // console.log("Fetched Documents:", docsArray);
        setOtherEstates(docsArray);
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore(app);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError('No such document!');
          }
        } else {
          setError('No authenticated user found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8}>
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
              fontSize="small"
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

  const TopLocationCard = ({ data }) => (
    <TouchableOpacity style={styles.topLocationView} activeOpacity={0.8}>
      <Image
        source={{ uri: data.image }}
        style={styles.topLoactionImg}
      />
      <FText
        fontSize="medium"
        fontWeight="700"
        color={colours.typography_80}
        style={{ marginBottom: 4 }}
      >
        {data.name}
      </FText>
    </TouchableOpacity>
  );

  const NearByCard = ({ data }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('OtherPropertyDetail', { id: data.id, location: data.Location, name: data.Name })}
      style={styles.nearByView}>
      <Image
        source={{ uri: data.ImageURL }}
        style={styles.nearByImg}
      />
      <View style={styles.tagnearView}>
        <FText fontSize="small" fontWeight="900" color={colours.secondary}>
          ${data.Price.toLocaleString()}{" "}
        </FText>
      </View>
      <FText
        fontSize="normal"
        fontWeight="700"
        color={colours.typography_80}
        style={{ marginTop: 14, marginLeft: 18, fontWeight: 'bold' }}
      >
        {data.Name}
      </FText>
      <View style={styles.rateingandLocation}>
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
        <View
          style={{ ...styles.locationView, marginBottom: 0, marginLeft: 4 }}
        >
          <Image
            source={require(ImgPath + "location.png")}
            style={styles.location}
          />
          <FText
            fontSize="small"
            fontWeight="400"
            color={colours.typography_80}
          >
            {data.State}
          </FText>
        </View>
      </View>
    </TouchableOpacity>
  );



  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dataContainer}>
          <View style={styles.headerSection}>


            <View style={styles.profileView}>
              <View style={styles.notificationView}>
                <Image
                  source={require(ImgPath + "notification.png")}
                  style={styles.notification}
                />
              </View>
              <View style={styles.personView}>
                <Image
                  source={{ uri: userData?.profilePic }}
                  style={styles.person}
                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <FText
              fontSize="h5"
              fontWeight="700"
              color={colours.primary}
              style={{ marginTop: 5, zIndex: -1 }}
            >
              Welcome

              {"\n"}{userData?.fullName}!
            </FText>
            <Icon name="hands-clapping" size={40} color='#E4D00A' style={{ marginTop: 35 }} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 21,
              zIndex: -1,
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TabData.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setActiveTab(index)}
                    style={{
                      backgroundColor:
                        activeTab === index ? colours.primary : "transparent",
                      paddingHorizontal: 25,
                      paddingVertical: 8,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <FText
                      key={index}
                      fontSize="medium"
                      fontWeight="400"
                      color={
                        activeTab === index
                          ? colours.secondary
                          : colours.typography_80
                      }
                    >
                      {item}
                    </FText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.ListingContainer} onPress={() => navigation.navigate('ListingForm')}>
            <Icons name="pluscircle" size={40} color='#8BC83F' />
            <FText fontSize="large" fontWeight={700} color={colours.primary}> Create your own listing </FText>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <FText fontSize="h6" fontWeight="900" color={colours.primary}>
              Featured Estates
            </FText>

            <FText fontSize="small"
              fontWeight="400"
              color={colours.primary}
              onPress={() => navigation.navigate('Estates')}>
              View All
            </FText>

          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {estates.length === 0 ? (
                <Text>Loading...</Text>
              ) : (
                filteredEstates.map(estate => (
                  <FeaturedCard key={estate.id} data={estate} />
                ))
              )}
            </ScrollView>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <FText fontSize="h6" fontWeight="900" color={colours.typography_80}>
              Top Locations
            </FText>
            <FText
              fontSize="small"
              fontWeight="400"
              color={colours.primary}
              onPress={() => navigation.navigate("TopLocations")}
            >
              explore
            </FText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Locations.map((item, index) => (
                <TopLocationCard key={index} data={item} />
              ))}
            </ScrollView>
          </View>

          <FText
            fontSize="h6"
            fontWeight="900"
            color={colours.typography_80}
            style={{ marginTop: 22 }}
          >
            Explore Nearby Estates
          </FText>

          <FlatList
            data={otherfilteredEstates}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <NearByCard data={item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        </View>
      </ScrollView>
    </View>

  )
}

export default SellerDashboard;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  dataContainer: {
    flex: 1,
    marginHorizontal: "4%",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    marginTop: "5%",
  },

  ListingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#F4F5F8',
    width: '100%',
    marginLeft: 0,
    marginTop: 20,
    marginBottom: 21,
    borderRadius: 10

  },
  dropDownView: {
    backgroundColor: "#F2F2F2",
    width: "50%",
    height: 51,
    borderRadius: 25,
  },
  dropdown: {
    backgroundColor: "#F5F4F8",
    borderColor: colours.primary,
    fontFamily: fonts.LatoRegular,
    borderColor: '#F4F5F8',
    borderWidth: 1,
    zIndex: 1000

  },
  dropdownList: {
    borderColor: "#A1A5C1",

  },
  text: {
    fontFamily: fonts.LatoRegular,
    fontSize: 18,
    color: colours.primary
  },
  listItemLabelStyle: {
    backgroundColor: '#F4F5F8',
    color: colours.primary,
    fontFamily: fonts.LatoBold

  },
  profileView: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-end",
  },
  notificationView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderColor: "#DFDFDF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  personView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderColor: "#DFDFDF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    width: 22,
    height: 22,
  },
  person: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F4F8",
    height: 60,
    borderRadius: 2,
    marginTop: 21,
    paddingHorizontal: 10,
    zIndex: -1,
  },
  verticalLine: {
    height: 30,
    width: 1,
    backgroundColor: "#DFDFDF",
    marginHorizontal: 10,
  },
  suggestionView: {
    width: '100%',
    height: 200,
    marginRight: 20,
  },
  imgShadow: {
    position: "absolute",
    width: 350,
    height: 370,
    backgroundColor: "#000",
    opacity: 0.2,
    borderRadius: 30,
    marginTop: 20,
    zIndex: 1,
  },
  featuredCard: {
    width: 265,
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
  heartImg: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: 20,
    left: 12,
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
  featuretextView: {
    alignItems: "flex-start",
    marginLeft: 10,
  },
  topLocationView: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F4F8",
    paddingLeft: 6,
    paddingRight: 20,
    borderRadius: 180,
    marginRight: 10,
  },
  topLoactionImg: {
    width: 30,
    height: 30,
    borderRadius: 40 / 2,
    marginTop: 10,
    resizeMode: "contain",
    marginRight: 7
  },
  architectsView: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    padding: 5,
  },
  architectsImgView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F4F8",
    alignItems: "center",
    justifyContent: "center",
  },
  architectsImg: {
    width: 90,
    height: 90,
    borderRadius: 40,
    resizeMode: "contain",
  },
  nearByView: {
    width: "48%",
    height: 240,
    backgroundColor: "#F5F4F8",
    borderRadius: 20,
    marginTop: 22,
  },
  nearByImg: {
    width: "100%",
    height: "66%",
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 6,
  },
  rateingandLocation: {
    marginTop: 4,
    flexDirection: "row",
    marginLeft: 16,
  },
  heartnearImg: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: 15,
    right: 14,
  },
  tagnearView: {
    position: "absolute",
    bottom: "36%",
    right: 14,
    backgroundColor: colours.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
