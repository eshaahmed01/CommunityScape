import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Animated, Pressable, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
const ImgPath = "../assets/images/Home/";
import Icons from 'react-native-vector-icons/Entypo'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import * as ScreenCapture from 'expo-screen-capture';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';

const Ad = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estateData, setEstateData] = useState(null);
  const [allEstates, setAllEstates] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(500)).current;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => { getAllEstates(); }, [])
  );

  const getAllEstates = async () => {
    try {
      const q = query(collection(db, "Estates"));
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllEstates(docsArray);
      return docsArray;
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Adding ordinal suffix to the day
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${daySuffix(day)} ${month}, ${year}`;
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: 300,
      useNativeDriver: true,
      tension: 20,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const fnMarkAsSold = async () => {
    try {
      setLoading(true);
      const estateDocRef = doc(db, 'Estates', estateData?.id);
      await updateDoc(estateDocRef, {
        isSold: estateData?.isSold ? false : true,
      });
      const response = await getAllEstates();
      if (response?.length > 0) {
        closeModal();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      closeModal();
    }
  };

  const fnOnEdit = (data) => {
    navigation.navigate('ListingForm', { docId: data?.id });
  };

  const handleDeleteListing = async () => {
    setLoading(true);
    try {
      const estateDocRef = doc(db, 'Estates', estateData?.id);
      const estateDetailsCollectionRef = collection(db, 'Estates', estateData?.id, 'EstateDetails');

      const estateDetailsSnapshot = await getDocs(estateDetailsCollectionRef);
      const deleteDetailsPromises = estateDetailsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deleteDetailsPromises);

      await deleteDoc(estateDocRef);

      await getAllEstates();
      setEstateData(null);
      setDeleteModalVisible(false);
      setLoading(false);
      console.log(`Document with ID ${estateData?.id} and its EstateDetails have been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting document and its details:', error);
      setEstateData(null);
      setDeleteModalVisible(false);
      setLoading(false);
    }
  };

  const handleLeads = () => {
    navigation.navigate("Leads")
  }

  // Get the current date
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);



  const FeaturedCard = ({ data, index }) => {

    const cardRef = useRef();
    const cardDetails = `
✨Check out this stunning ${data?.Type === 'House' ? 'House' : 'Apartment'} Listing✨
🏠 Name: ${data?.Name}
📍 Location: ${data?.Location}
💵 Price: $${data?.Price}
⭐ Rating: ${data?.Rating}
🏢 Type: ${data?.Type}
This beautiful ${data?.Type === 'House' ? 'house' : 'apartment'} is now available, and it's the perfect opportunity for those looking to invest in a vibrant San Francisco neighborhood. Don't miss out on this deal!
`

    const fnOnShare = () => {
      setTimeout(async () => {
        try {
          const uri = await captureRef(cardRef, {
            format: 'jpg',
            quality: 0.8,
          });

          await Share.open({
            url: uri,
            message: cardDetails
          });
          closeModal();
        } catch (e) {
          console.log(e);
        }
      }, 500);
    };

    return (
      <ViewShot ref={cardRef} key={index} style={{ flexDirection: 'column', backgroundColor: "#F5F4F8", borderRadius: 20, marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('PropertyDetail', { id: data.id, location: data.Location, name: data.Name })} style={styles.featuredCard} activeOpacity={0.8} >
          <Image
            source={{ uri: data?.ImageURL }}
            style={styles.featureImg}
          />

          <View style={styles.tagView}>
            <FText fontSize="small" fontWeight="400" color={colours.secondary}>
              {data.Type}
            </FText>
          </View>
          <View style={styles.featuretextView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
              <FText
                fontSize="large"
                fontWeight="700"
                color={colours.typography_80}
                style={{ marginTop: 4 }}
              >
                {data.Type}
              </FText>
              <TouchableOpacity onPress={() => { setEstateData(data); openModal(); }}>
                <Icons name='dots-three-vertical' size={20} style={{}}> </Icons>
              </TouchableOpacity>
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
                style={{ flexWrap: 'wrap', maxWidth: '80%', marginTop: 18 }}
              >
                {data?.Location}
              </FText>
            </View>
            <FText
              fontSize="medium"
              fontWeight="700"
              color={colours.typography_80}
              style={{ marginTop: 10 }}
            >
              ${data?.Price?.toLocaleString()}

            </FText>
            {data?.isSold ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
                <FText fontSize='medium' fontWeight={900} color={colours.primary} style={{ marginLeft: -30 }}> Sold </FText>
              </View>
            ) : (

              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -16 }}>
                <Icons name='dot-single' size={40} color='#8BC83F'> </Icons>
                <FText fontSize='medium' fontWeight={900} color='#8BC83F' style={{ marginLeft: -30 }}> Active </FText>
                <FText fontSize='small' fontWeight={700} color="#A1A5C1" style={{ marginLeft: 0 }}>from {formattedDate} </FText>
              </View>

            )}

          </View>



        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10, marginTop: 20, paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => fnOnEdit(data)} style={{ backgroundColor: colours.primary, borderRadius: 10, width: '30%', padding: 10, alignItems: 'center' }}>
            <FText fontSize='normal' fontWeight={600} color={colours.secondary}>  Edit </FText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setEstateData(data); setDeleteModalVisible(true) }} style={{ backgroundColor: colours.primary, borderRadius: 10, width: '30%', padding: 10, alignItems: 'center', marginLeft: 10 }}>
            <FText fontSize='normal' fontWeight={600} color={colours.secondary}>  Delete </FText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { fnOnShare() }} style={{ backgroundColor: colours.primary, borderRadius: 10, width: '30%', padding: 10, alignItems: 'center', marginLeft: 10 }}>
            <FText fontSize='normal' fontWeight={600} color={colours.secondary}>  Share </FText>
          </TouchableOpacity>
        </View>

      </ViewShot>
    )
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.mainContainer} >
        <View style={styles.headerView}>
          <BackButton> </BackButton>

        </View>

        <View style={{ flexDirection: 'row' }}>
          <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{ marginTop: 20, marginLeft: 15, marginBottom: 20 }}> Your Listings </FText>
        </View>

        <View style={{ alignItems: 'center' }}>
          {
            allEstates?.map((estate, index) => <FeaturedCard key={index} data={estate} index={index} />)
          }
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >

        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>

            <View style={{ alignItems: 'center' }}>

              <TouchableOpacity disabled={loading} onPress={() => fnMarkAsSold()} style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', borderRadius: 10 }}>
                {loading ? <ActivityIndicator color={colours.primary} />
                  : <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}>
                    {estateData?.isSold ? 'Mark as unsold' : 'Mark as sold'}
                  </FText>}
              </TouchableOpacity>
              
              <TouchableOpacity disabled={loading} onPress={handleLeads} style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', borderRadius: 10, marginTop: 10 }}>
                {loading ? <ActivityIndicator color={colours.primary} />
                  : <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}>
                    Check Leads
                  </FText>}
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => fnOnShare()} style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', marginTop: 20, borderRadius: 10 }}>
                <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}> Share </FText>
              </TouchableOpacity> */}
            </View>

          </Animated.View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalView}>
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name='error' size={24} color={colours.primary} style={{ marginTop: 1, marginRight: 5 }} />
              <FText fontSize="large" fontWeight="700" color={colours.typography_60}>
                Are you sure you want to delete the listing?
              </FText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity disabled={loading} style={styles.deleteButton} onPress={handleDeleteListing} >
                {loading ? <ActivityIndicator color={'white'} /> : <FText fontSize="medium" fontWeight={700} color={colours.white}>
                  Yes
                </FText>}
              </TouchableOpacity>

              <TouchableOpacity disabled={loading} style={[styles.deleteButton, { marginLeft: 10 }]} onPress={() => { setEstateData(null); setDeleteModalVisible(false) }} >
                <FText fontSize="medium" fontWeight={700} color={colours.white}>
                  Cancel
                </FText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  )
}

export default Ad;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.secondary
  },
  headerView: {
    flexDirection: "row",
    marginTop: 21,
    height: 104,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  featuredCard: {
    width: 350,
    height: 200,
    backgroundColor: "#F5F4F8",
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  featureImg: {
    width: 120,
    height: 200,
    borderRadius: 20,
    resizeMode: "cover",
    marginLeft: 6,
  },
  tagView: {
    position: "absolute",
    bottom: 7,
    left: 12,
    backgroundColor: colours.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalView: {
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  deleteModalView: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  deleteModalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#8BC83F',
    height: 30,
    width: '30%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',

  },

});

// import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Animated, Pressable, ActivityIndicator } from 'react-native'
// import { colours } from '../constants/colours'
// import FText from '../components/Ftext'
// import BackButton from '../components/BackButtons'
// import { useRoute } from '@react-navigation/native';
// const ImgPath = "../assets/images/Home/";
// import Icons from 'react-native-vector-icons/Entypo'
// import React, { useState, useEffect, useRef } from 'react'
// import { collection, doc, getDoc, getDocs, limit, query, updateDoc } from 'firebase/firestore'
// import { db } from '../firebaseconfig'

// const Ad = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [estateData, setEstateData] = useState(false);
//   const slideAnim = useRef(new Animated.Value(1000)).current;
//   const route = useRoute();

//   const { docId } = route.params;

//   const getSingleEstate = async () => {
//     try {
//       const estateDocRef = doc(db, 'Estates', docId);
//       const estateDoc = await getDoc(estateDocRef);

//       if (estateDoc.exists()) {
//         let response = { id: estateDoc.id, ...estateDoc.data(), estateDetails: null, estateReviews: null };

//         const estateDetailsRef = collection(estateDocRef, 'EstateDetails');
//         const estateDetailsQuery = query(estateDetailsRef, limit(1));
//         const estateDetailsSnapshot = await getDocs(estateDetailsQuery);

//         if (!estateDetailsSnapshot.empty) {
//           const detailDoc = estateDetailsSnapshot.docs[0];
//           response.estateDetails = { id: detailDoc.id, ...detailDoc.data() };
//         } else {
//           console.log('No EstateDetails found');
//         }

//         const reviewsRef = collection(estateDocRef, 'Reviews');
//         const reviewsQuery = query(reviewsRef, limit(1));
//         const reviewsSnapshot = await getDocs(reviewsQuery);

//         if (!reviewsSnapshot.empty) {
//           const reviewDoc = reviewsSnapshot.docs[0];
//           response.estateReviews = { id: reviewDoc.id, ...reviewDoc.data() };
//         } else {
//           console.log('No Reviews found');
//         }

//         setEstateData(response);
//         return response;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   useEffect(() => { getSingleEstate() }, [docId]);

//   const formatDate = (date) => {
//     const day = date.getDate();
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();

//     // Adding ordinal suffix to the day
//     const daySuffix = (day) => {
//       if (day > 3 && day < 21) return 'th';
//       switch (day % 10) {
//         case 1: return 'st';
//         case 2: return 'nd';
//         case 3: return 'rd';
//         default: return 'th';
//       }
//     };

//     return `${day}${daySuffix(day)} ${month}, ${year}`;
//   };

//   const openModal = () => {
//     setModalVisible(true);
//     Animated.spring(slideAnim, {
//       toValue: 0,
//       useNativeDriver: true,
//       tension: 20,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.spring(slideAnim, {
//       toValue: 300,
//       useNativeDriver: true,
//       tension: 20,
//     }).start(() => setModalVisible(false));


//   };

//   const fnMarkAsSold = async (soldData) => {
//     try {
//       setLoading(true);
//       const estateDocRef = doc(db, 'Estates', docId);
//       await updateDoc(estateDocRef, {
//         isSold: soldData ? false : true,
//       });
//       const response = await getSingleEstate();
//       if (response) {
//         closeModal();
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       closeModal();
//     }
//   };

//   // Get the current date
//   const currentDate = new Date();
//   const formattedDate = formatDate(currentDate);

//   const FeaturedCard = ({ data }) => {
//     return (
//       <View style={{ flexDirection: 'column', backgroundColor: "#F5F4F8", borderRadius: 20 }}>
//         <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8} >
//           <Image
//             source={{ uri: data?.ImageURL }}
//             style={styles.featureImg}
//           />

//           <View style={styles.tagView}>
//             <FText fontSize="small" fontWeight="400" color={colours.secondary}>
//               {data.Type}
//             </FText>
//           </View>
//           <View style={styles.featuretextView}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
//               <FText
//                 fontSize="large"
//                 fontWeight="700"
//                 color={colours.typography_80}
//                 style={{ marginTop: 4 }}
//               >
//                 {data.Type}
//               </FText>
//               <TouchableOpacity onPress={openModal}>
//                 <Icons name='dots-three-vertical' size={20} style={{}}> </Icons>
//               </TouchableOpacity>
//             </View>

//             <Modal
//               transparent={true}
//               visible={modalVisible}
//               animationType="none"
//               onRequestClose={closeModal}
//             >

//               <Pressable style={styles.modalOverlay} onPress={closeModal}>
//                 <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>

//                   <View style={{ alignItems: 'center' }}>

//                     <TouchableOpacity disabled={loading} onPress={() => fnMarkAsSold(data.isSold)} style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', borderRadius: 10 }}>
//                       {loading ? <ActivityIndicator color={colours.primary} />
//                         : <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}>
//                           {data.isSold ? 'Mark as unsold' : 'Mark as sold'}
//                         </FText>}
//                     </TouchableOpacity>
//                     <TouchableOpacity style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', marginTop: 20, borderRadius: 10 }}>
//                       <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}> Share </FText>
//                     </TouchableOpacity>
//                   </View>

//                 </Animated.View>
//               </Pressable>
//             </Modal>



//             <View style={styles.locationView}>
//               <Image
//                 source={require(ImgPath + "location.png")}
//                 style={styles.location}
//               />
//               <FText
//                 fontSize="medium"
//                 fontWeight="400"
//                 color={colours.typography_80}
//                 style={{ flexWrap: 'wrap', maxWidth: '80%', marginTop: 18 }}
//               >
//                 {data?.Location}
//               </FText>
//             </View>
//             <FText
//               fontSize="medium"
//               fontWeight="700"
//               color={colours.typography_80}
//               style={{ marginTop: 10 }}
//             >
//               {data?.Price}

//             </FText>
//             {data.isSold ? (
//               <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
//                 <FText fontSize='medium' fontWeight={900} color={colours.primary} style={{ marginLeft: -30 }}> Sold </FText>
//               </View>
//             ) : (

//               <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -16 }}>
//                 <Icons name='dot-single' size={40} color='#8BC83F'> </Icons>
//                 <FText fontSize='medium' fontWeight={900} color='#8BC83F' style={{ marginLeft: -30 }}> Active </FText>
//                 <FText fontSize='small' fontWeight={700} color="#A1A5C1" style={{ marginLeft: 0 }}>from {formattedDate} </FText>
//               </View>

//             )}

//           </View>



//         </TouchableOpacity>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 20 }}>
//           <TouchableOpacity style={{ backgroundColor: colours.primary, borderRadius: 10, width: '30%', padding: 10, alignItems: 'center' }}>
//             <FText fontSize='medium' fontWeight={700} color={colours.secondary}>  Edit </FText>
//           </TouchableOpacity>
//           <TouchableOpacity style={{ backgroundColor: colours.primary, borderRadius: 10, width: '30%', padding: 10, alignItems: 'center', marginLeft: 10 }}>
//             <FText fontSize='medium' fontWeight={700} color={colours.secondary}>  Delete </FText>
//           </TouchableOpacity>
//         </View>

//       </View>
//     )
//   };

//   return (
//     <ScrollView style={styles.mainContainer}>
//       <View style={styles.mainContainer}>
//         <View style={styles.headerView}>
//           <BackButton> </BackButton>

//         </View>

//         <View style={{ flexDirection: 'row' }}>
//           <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{ marginTop: 20, marginLeft: 15, marginBottom: 20 }}> Your Listings </FText>
//         </View>

//         <View style={{ alignItems: 'center' }}>
//           <FeaturedCard data={estateData} />
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// export default Ad;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: colours.secondary
//   },
//   headerView: {
//     flexDirection: "row",
//     marginTop: 21,
//     height: 104,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   featuredCard: {
//     width: 350,
//     height: 200,
//     backgroundColor: "#F5F4F8",
//     borderRadius: 20,
//     marginTop: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 20,
//   },
//   featureImg: {
//     width: 120,
//     height: 200,
//     borderRadius: 20,
//     resizeMode: "cover",
//     marginLeft: 6,
//   },
//   tagView: {
//     position: "absolute",
//     bottom: 7,
//     left: 12,
//     backgroundColor: colours.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   ratingView: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   locationView: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//     marginBottom: 18,
//   },
//   featuretextView: {
//     alignItems: "flex-start",
//     marginLeft: 10,
//   },
//   rating: {
//     width: 14,
//     height: 14,
//     resizeMode: "contain",
//   },
//   location: {
//     width: 14,
//     height: 14,
//     resizeMode: "contain",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',

//   },
//   modalView: {
//     marginTop: 'auto',
//     backgroundColor: 'white',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     padding: 35,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },

// });
