import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, FlatList, TextInput, Modal } from 'react-native';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import FText from '../components/Ftext';
import { useState, useEffect } from 'react';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where, serverTimestamp } from "firebase/firestore";
import BackButton from '../components/BackButtons';
import HorizontalImageCarousel from '../components/HorizontalImageCarousel';
import { Rating } from 'react-native-ratings';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig'; // Adjust the path as necessary


//card for rendering reviews
export const ReviewCard = ({ name, image, rating, review, date }) => (
    <View style={styles.reviewView}>
        <Image source={{uri: image}} style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 20 }} />
        <View style={{ marginLeft: 10, width: '70%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <FText fontSize='large' fontWeight='700' color={colours.primary}>{name}</FText>
                <Rating
                    type='custom'
                    ratingCount={5}
                    imageSize={20}
                    ratingColor='#FDB54A'
                    startingValue={rating}
                    ratingBackgroundColor='#c8c7c8'
                    style={{ paddingVertical: 10 }}
                />
            </View>
            <FText fontSize='normal' fontWeight='400' color={colours.typography_60}>{review}</FText>
            <FText fontSize='small' fontWeight='400' color={colours.waterloo}>{date}</FText>
        </View>
    </View>
);

const ProfileDetails = ({ route, navigation }) => {

    const {id, image, name,homeSold } = route.params;
    console.log(name);

    const [architects, setArchitects] = useState([]);
    const [rating, setRating] = useState(0)
    const [reviewInput, setReviewInput] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);
    const [userData, setUserData] = useState(null);
    



//// fetching Architects Data
useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const q = query(collection(db, "Architects"))
        const querySnapshot = await getDocs(q);
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched Documents in Profile Detail:", docsArray);
        const filteredArchitect = docsArray.filter(architect => architect.Name === name);
        console.log("Filtered Architect:", filteredArchitect);
        setArchitects(filteredArchitect);
       
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

  console.log("User's data is", userData);

//reviews and ratings for architects
const addReview = async (architectId: string, rating: number, desc: string, userId: string, userImage: string) => {
    try {
        const review = {
            rating,
            desc,
            userId,
            createdAt: Date.now(),
            userImage
        };
        const reviewsCollectionRef = collection(db, `Architects/${architectId}/Reviews`);
        await addDoc(reviewsCollectionRef, review);
        console.log('Review added successfully');
        setModalVisible(true);

    setTimeout(() => {
        setModalVisible(false);
    }, 1000);
    } catch (error) {
        console.error('Error adding review: ', error);
    } finally {
        setRating(0);
        setReviewInput('');
    }
};

const [reviews, setReviews] = useState([]);


const fetchReviews = async (architectId: string) => {
    try {
        const reviewsCollectionRef = collection(db, `Architects/${architectId}/Reviews`);
        const querySnapshot = await getDocs(reviewsCollectionRef);
        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log('Reviews fetched successfully:', reviews);
        setReviews(reviews);
        setReviewCount(reviews.length);
    } catch (error) {
        console.error('Error fetching reviews: ', error);
    }
};

const handleReview = () => {
    addReview(id, rating, reviewInput, userData?.fullName, userData?.profilePic)
    // refetch reviews
    fetchReviews(id);
};

useEffect(() => {
    
    fetchReviews(id);
}, []);





      if (architects.length === 0) {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 30}}>
            <Text style={{ textAlign: 'center', fontSize: 30}}>Loading...</Text>
        </View>
    );
}

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: '5%', marginTop: '5%' }}>

                    <BackButton> </BackButton>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, width: '100%'}}> 
                <FText color={colours.typography_60} 
                    fontSize='h4' 
                    fontWeight={700} 
                    >
                    Profile
                </FText>
                    </View>
                    
                </View>
                <FText style={{ alignSelf: 'center', marginTop: '10%' }} fontSize='large' fontWeight={700} color={colours.typography_60}>{architects[0].Name}</FText>
                <FText style={{alignSelf: 'center', marginTop: '1%' }} fontSize='small' fontWeight={400}> {architects[0].Email} </FText>

                <Image style={{ height: 95, width: 95, alignSelf: 'center', marginTop: "5%", borderRadius: 95 / 2 }} source={{uri: architects[0].ProfileImage}} />
                <Image resizeMode='contain' style={{ height: 25, width: 25, position: 'relative', left: 200, bottom: 24 }} source={require('../assets/images/Profile/1.png')} />

                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: '5%', marginTop: '8%' }}>
                    <View style={{ height: 70, width: '30%', backgroundColor: '#F5F4F8', borderRadius: 20, alignItems: 'center', justifyContent: "center" }}>
                        <Text style={{ color: colours.typography_80, fontFamily: fonts.LatoBold, fontSize: 14, marginTop: '2%' }}>{architects[0].Rating}</Text>
                        <Image resizeMode='contain' style={{ height: 16, width: '89%', marginTop: '4%' }} source={require('../assets/images/Profile/stars.png')} />
                    </View>


                    <View style={{ height: 70, width: '30%', backgroundColor: '#F5F4F8', borderRadius: 20, alignItems: 'center', justifyContent: "center" }}>
                        <Text style={{ color: colours.typography_80, fontFamily: fonts.LatoBold, fontSize: 14, marginTop: '2%' }}>{reviewCount}</Text>
                        <Text style={{ color: colours.typography_80, fontFamily: fonts.LatoRegular, fontSize: 14, marginTop: '2%' }}>Reviews</Text>
                    </View>


                    <View style={{ height: 70, width: '30%', backgroundColor: '#F5F4F8', borderRadius: 20, alignItems: 'center', justifyContent: "center"}}>
                        <Text style={{ color: colours.typography_80, fontFamily: fonts.LatoBold, fontSize: 14, marginTop: '2%' }}>{homeSold}</Text>
                        <Text style={{ color: colours.typography_80, fontFamily: fonts.LatoRegular, fontSize: 14, marginTop: '2%' }}>Sold</Text>
                    </View>
                </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between',borderRadius: 10,  backgroundColor: '#F5F4F8', marginTop: 20, marginBottom: 10, marginLeft: 20,width: '90%', padding: 10}}> 
                <FText fontSize='large' fontWeight={700} color={colours.typography_60}> Availablity </FText>
                <FText fontSize='normal' fontWeight={400} color={colours.typography_60}> 9am-5pm EST </FText>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between',borderRadius: 10, backgroundColor: '#F5F4F8', marginTop: 10, marginBottom: 20, marginLeft: 20,width: '90%', padding: 10}}> 
                <View> 
                <FText fontSize='large' fontWeight={700} color={colours.typography_60}> Hourly Rate </FText>
                <FText fontSize='small' fontWeight={400} color={colours.typography_60}> depending on project and services </FText>
                </View>
                <FText fontSize='normal' fontWeight={400} color={colours.typography_60}> {architects[0].Rate} </FText>
               </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '6%' }}>
                    <FText style={{ marginTop: '2%', marginRight: "auto" }} fontSize='large' fontWeight={700} color={colours.typography_60}> Previous Projects </FText>
                </View>
                 <View style={styles.bgImageContainer}>
                 <HorizontalImageCarousel images={architects[0].Images}> </HorizontalImageCarousel>
                 </View> 

                {/* reviews and ratings */}

                <FText fontSize='h6' fontWeight='700' color={colours.primary} style={{ marginLeft: 20, marginTop: 20 }}>Reviews</FText>
                        {reviews.slice(0,2).map(review => (
                            <ReviewCard
                                key={review.id}
                                name={review.userId}
                                image={review.userImage}
                                rating={review.rating}
                                review={review.desc}
                                date={new Date(review.createdAt?.seconds * 1000).toLocaleString()}
                            />
                        ))}
                        <TouchableOpacity style={{ backgroundColor: '#F5F4F8', paddingVertical: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center' }} onPress={() => navigation.navigate('ReviewsDetail', { reviews })}>
                            <FText fontSize='large' fontWeight='700' color={colours.primary}>View all reviews</FText>
                        </TouchableOpacity>
                        <FText fontSize='h6' fontWeight='700' color={colours.primary} style={{ marginLeft: 20, marginTop: 20 }} >Add your review</FText>
                        <TextInput
                            placeholder="Write your review here..."
                            placeholderTextColor={colours.waterloo}
                            style={{ backgroundColor: '#F5F4F8', padding: 10, borderRadius: 10, marginHorizontal: 20, marginTop: 10, textAlignVertical: 'top' }}
                            multiline
                            numberOfLines={6}
                            value={reviewInput}
                            onChangeText={text => setReviewInput(text)}
                        />
                       
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    <FText fontSize='large' fontWeight='400' color={colours.typography_60}>Review Added!</FText>
                                </View>
                            </View>
                        </Modal>

                        <FText style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 20 }} fontSize='h6' fontWeight='700' color={colours.primary} >Rate this Property</FText>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            imageSize={30}
                            ratingColor='#FDB54A'
                            startingValue={rating}
                            ratingBackgroundColor='#c8c7c8'
                            style={{ paddingVertical: 10, alignSelf: 'center' }}
                            onFinishRating={rating => setRating(rating)}
                        />
                        <TouchableOpacity style={{ backgroundColor: '#8BC83F', borderRadius: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center', width: '60%', height: 46, justifyContent: 'center', alignSelf: 'center', marginBottom: 20 }} onPress={() => handleReview()}>
                            <FText fontSize='large' fontWeight='400' color={colours.white}>Submit</FText>
                        </TouchableOpacity>

                       
            </ScrollView>
            <TouchableOpacity style={{ height: 63, width: '90%', alignSelf: "center", alignItems: "center", justifyContent: 'center', backgroundColor: '#8BC83F', marginTop: 10 }}>
                    <Text style={{ color: colours.white, fontFamily: fonts.LatoBold, fontSize: 16 }}>Start Chat</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.secondary

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    // Add more styles as needed
    list: {
        paddingHorizontal: 10,
    },
    item: {
        height: 231,
        width: 160,
        margin: 5,
        backgroundColor: '#F5F4F8',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 1

    },
    imageBackground: {
        height: 160,
        width: 144,
        alignSelf: 'center',
        marginTop: "5%"
    },
    image: {
        width: 144,
        height: 160,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    name: {
        fontSize: 12,
        color: colours.typography_80,
        fontFamily: fonts.LatoBold,
        marginLeft: '8%',
        marginTop: "5%"

    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 10,
        marginTop: '7%'
    },
    rating: {
        marginLeft: 5,
        marginRight: 15,
        fontSize: 8,
        color: colours.typography_80,
        fontFamily: fonts.LatoBold,

    },
    locationIcon: {
        marginLeft: 10,
    },
    location: {
        marginLeft: 5,
        marginRight: 15,
        fontSize: 8,
        color: colours.typography_80,
        fontFamily: fonts.LatoRegular,
    },
    bgImageContainer: {
        marginTop: 20,
        width: '90%',
        overflow: 'hidden',
        height: 360,
        alignSelf: 'center',
        borderRadius: 20,
        // marginTop: '8%',
        position: 'relative',
    },

    reviewView: {
        width: '90%',
        paddingVertical: 20,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: '#F5F4F8',
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default ProfileDetails;
