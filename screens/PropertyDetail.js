import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colours } from '../constants/colours'
import { Rating } from 'react-native-ratings';
import BackButton from '../components/BackButtons';
import FText from '../components/Ftext';
import { db } from "../firebaseconfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc } from "firebase/firestore";
import HorizontalImageCarousel from '../components/HorizontalImageCarousel';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig'; // Adjust the path as necessary
import fonts from '../constants/fonts';
import useUserManager from '../hooks/useUserManager';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';


const PropertyDetail = ({ route, navigation }) => {

    const { currentUser } = useUserManager();

    const [estates, setEstates] = useState([]);
    const [estateDetails, setEstateDetails] = useState({});
    const [estateDataObj, setEstateDataObj] = useState({});
    const [favModalVisible, setFavModalVisible] = useState(false);
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [sellerName, setSellerName] = useState(null);
    const [sellerPhone, setSellerPhone] = useState(null);
    const [sellerEmail, setSellerEmail] = useState(null);
    const [sellerMessage, setSellerMessage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const [favoriteLoader, setFavoriteLoader] = useState(false);

    const handleSellerForm = async () => {
        try {
            if (!sellerName) {
                Alert.alert("Enter your name");
                return;
            }

            if (!sellerPhone) {
                Alert.alert("Enter your phone number");
                return;
            }

            if (!sellerEmail) {
                Alert.alert("Enter your email");
                return;
            }

            if (!sellerMessage) {
                Alert.alert("Enter your message to seller");
                return;
            }
            setLoader(true);
            const body = {
                name: sellerName,
                phone: sellerPhone,
                email: sellerEmail,
                message: sellerMessage,
                createdAt: Date.now()
            };

            const estateId = estates[0]?.id;

            const leadsCollectionRef = collection(db, `Estates/${estateId}/Leads`);
            await addDoc(leadsCollectionRef, body);
            setContactModalVisible(false);
            setLoader(false);
            setSellerName(null);
            setSellerEmail(null);
            setSellerMessage(null);
            setSellerPhone(null);
        } catch (error) {
            console.log(error)
            setLoader(false);
        }

    }



    const [userData, setUserData] = useState(null);
    const { id, location, name } = route.params;

    // Function to fetch estate details based on estate ID
    const fetchEstateDetails = async (estateId: string, db: any) => {
        try {
            const estateDetailsRef = collection(db, "Estates", estateId, "EstateDetails");
            const estateDetailsSnapshot = await getDocs(estateDetailsRef);
            console.log("Estate Details Snapshot:", estateDetailsSnapshot);

            if (!estateDetailsSnapshot.empty) {
                const detailsArray = estateDetailsSnapshot.docs.map(doc => doc.data());
                console.log("Estate Details Array:", detailsArray);
                return detailsArray;
            } else {
                console.log("No estate details found!");
                return null;
            }
        } catch (e) {
            console.error("Error fetching estate details: ", e);
            return null;
        }
    };


    const fetchDocuments = async (location: string, db: any, fetchEstateDetails: (id: string) => Promise<any>, setEstates: (estates: any[]) => void, setEstateDetails: (details: any) => void) => {
        try {
            // Fetch the documents from the "Estates" collection
            const q = query(collection(db, "Estates"));
            const querySnapshot = await getDocs(q);

            // Map through the documents and extract the necessary data
            const docsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter the estates based on the provided location
            const filteredEstates = docsArray.filter(estate => estate.Location === location);
            console.log("Filtered Estates:", filteredEstates);

            // Set the filtered estates to the state
            setEstates(filteredEstates);

            // Fetch details for the first filtered estate
            if (filteredEstates.length > 0) {
                const estate = filteredEstates[0];
                console.log(`Fetching details for estate ${estate.id}...`);
                const results = await fetchEstateDetails(estate.id, db);

                // Set the estate details directly in the state
                setEstateDetails({
                    [estate.id]: results
                });
                setEstateDataObj(results);
                console.log('Estate details are: ', results);
            } else {
                console.log('No estates found for the given location.');
            }
        } catch (e) {
            console.error("Error getting documents: ", e);
        }
    };
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


    const addReview = async (estateId: string, rating: number, desc: string, userId: string, userImage: string) => {
        try {
            const review = {
                rating,
                desc,
                userId,
                createdAt: Date.now(),
                userImage
            };
            const reviewsCollectionRef = collection(db, `Estates/${estateId}/Reviews`);
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

    const fetchReviews = async (estateId: string) => {
        try {
            const reviewsCollectionRef = collection(db, `Estates/${estateId}/Reviews`);
            const querySnapshot = await getDocs(reviewsCollectionRef);
            const reviews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log('Reviews fetched successfully:', reviews);
            setReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews: ', error);
        }
    };

    const handleReview = () => {
        addReview(id, rating, reviewInput, userData.fullName, userData.profilePic)
        // refetch reviews
        fetchReviews(id);
    };

    const fnToggleFavorite = async (estateId) => {
        try {
            const favoriteRef = doc(db, "users", currentUser?.id, "favorites", estateId);

            const favoriteSnap = await getDoc(favoriteRef);

            if (favoriteSnap.exists()) {
                await deleteDoc(favoriteRef);
                return "Removed from favorites"
            } else {
                await setDoc(favoriteRef, {
                    estateId,
                    timestamp: new Date(),
                });
                return "Added to favorites"
            }
        } catch (error) {
            console.error("Error toggling favorite: ", error);
        }
    };

    useEffect(() => {
        fetchDocuments(location, db, fetchEstateDetails, setEstates, setEstateDetails);
        fetchReviews(id);
    }, [location]);

    useEffect(() => { checkFavoriteStatus(); }, [currentUser?.id, id]);

    const checkFavoriteStatus = async () => {
        const favoriteStatus = await isEstateInFavorites();
        setIsFavorite(favoriteStatus);
    };

    const handleFavourites = async () => {
        try {
            setFavoriteLoader(true);
            await fnToggleFavorite(id);
            await checkFavoriteStatus();
        } catch (error) {
            console.log(error)
        } finally {
            setFavoriteLoader(false);
        }
    };

    const isEstateInFavorites = async () => {
        if (currentUser?.id) {
            try {
                const favoriteRef = doc(db, "users", currentUser?.id, "favorites", id);
                const favoriteSnap = await getDoc(favoriteRef);

                return favoriteSnap.exists();
            } catch (error) {
                console.error("Error checking favorite status: ", error);
                return false;
            }
        }
    };

    const handleContactSeller = () => {
        setContactModalVisible(true);

    }


    const splitEstateName = (location) => {
        const words = location.split(' ');
        const lastWord = words.pop();
        const remainingText = words.join(' ');

        return { remainingText, lastWord };
    };

    const { remainingText, lastWord } = splitEstateName(name);

    const [rating, setRating] = useState(0)
    const [reviewInput, setReviewInput] = useState('')
    const [modalVisible, setModalVisible] = useState(false);


    const Images = {
        bgImage: require('../assets/img/ImgDetail1.jpg'),
        backImg: require('../assets/images/Profile/back.png'),
        heart: require('../assets/images/Home/fillHeart.png'),
        star: require('../assets/images/Home/star.png'),
        location: require('../assets/images/Home/location.png'),
        AnderSon: require('../assets/images/AnderSon.png'),
        locationBg: require('../assets/images/locationBg.png')
    }



    const formatState = (state) => {
        const parts = state.split(' ');
        return parts.join(', ');
    };

    const ExtractImage = () => {
        const ImagesArray = Object.keys(estateDetails).flatMap(key =>
            estateDetails[key].flatMap(listing => listing.Images)
        );
        return ImagesArray;
    };

    const ExtractAmenities = () => {
        const AmenitiesArray = Object.keys(estateDetails).flatMap(key =>
            estateDetails[key].flatMap(listing => listing.Amenities)
        );
        return AmenitiesArray
    }

    const ExtractDescription = () => {
        const DescriptionArray = Object.keys(estateDetails).flatMap(key =>
            estateDetails[key].flatMap(listing => listing.Description)
        );
        return DescriptionArray
    }

    return (
        <>
            <SafeAreaView style={styles.mainContainer}>
                {estates.length > 0 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.mainContainer}>
                            <BackButton />
                            <View style={styles.bgImageContainer}>
                                <HorizontalImageCarousel images={ExtractImage()} />

                                <TouchableOpacity style={[styles.heartBtn, isFavorite && { backgroundColor: colours.primary }]} onPress={handleFavourites}>
                                    <AntDesign name='heart' size={18} color={'white'} />
                                </TouchableOpacity>

                                <View style={styles.rowViewBgImg}>

                                    <View style={styles.tagView}>
                                        <Image source={Images.star} style={{ width: 20, height: 20 }} />
                                        <FText style={styles.bodyText} fontSize='normal' fontWeight='400' color={colours.white}>{estates[0].Rating}</FText>
                                    </View>
                                    <View style={{ ...styles.tagView, marginLeft: 10, width: 90 }}>
                                        <FText style={styles.bodyText} fontSize='normal' fontWeight='400' color={colours.white}>{estates[0].Type}</FText>
                                    </View>
                                </View>
                            </View>
                            {/* <EstateDetails estateDetails={estateDetails} /> */}
                            <View style={styles.headingView}>
                                {estates[0].Type === "Apartment" ? (<FText style={styles.headingText} fontSize='h5' fontWeight='900' color={colours.primary}>{remainingText}{'\n'}{lastWord}</FText>)
                                    :
                                    (<FText style={styles.headingText} fontSize='h5' fontWeight='900' color={colours.primary}>{estates[0].Name}</FText>)}
                                <FText style={styles.headingText} fontSize='h5' fontWeight='900' color={colours.primary}>${estates[0].Price.toLocaleString()}{" "}</FText>
                            </View>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 10 }}>
                                <Image source={Images.location} style={{ width: 20, height: 20 }} resizeMode='contain' />
                                <FText style={{ ...styles.bodyText, color: '#53587A', marginLeft: 5 }} fontSize='normal' fontWeight='400' color={colours.typography_60}>{formatState(estates[0].State)}</FText>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                                <FText style={{ paddingHorizontal: '5%', marginTop: 40 }} fontSize='h6' fontWeight='700' color={colours.primary}>Listed By</FText>
                                {estates[0].ListingType === "SellerListing" && (
                                    <TouchableOpacity
                                        onPress={() => setContactModalVisible(true)}
                                        style={{ marginLeft: 10, marginRight: 20, backgroundColor: colours.primary, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 40 }}
                                    >
                                        <FText fontSize='small' fontWeight={400} color={colours.white}>Contact Seller</FText>
                                    </TouchableOpacity>
                                )}

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={contactModalVisible}
                                    onRequestClose={() => {
                                        setContactModalVisible(!contactModalVisible);
                                    }}
                                >
                                    <View style={styles.modalOverlay}>
                                        <View style={styles.modalView}>
                                            <FText fontSize='large' fontWeight={700} color={colours.primary}> Seller Contact form </FText>
                                            <View style={styles.inputContainer}>
                                                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                                                    Name:
                                                </FText>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter complete address"
                                                    placeholderTextColor={"#A1A5C1"}
                                                    onChangeText={setSellerName}
                                                    value={sellerName}
                                                />
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                                                    Phone:
                                                </FText>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter complete address"
                                                    placeholderTextColor={"#A1A5C1"}
                                                    onChangeText={setSellerPhone}
                                                    value={sellerPhone}
                                                />
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                                                    Email:
                                                </FText>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter complete address"
                                                    placeholderTextColor={"#A1A5C1"}
                                                    onChangeText={setSellerEmail}
                                                    value={sellerEmail}
                                                />
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                                                    Message:
                                                </FText>
                                                <TextInput
                                                    style={[styles.input, styles.textArea]}
                                                    placeholder="Enter your message"
                                                    multiline
                                                    numberOfLines={2}
                                                    placeholderTextColor={"#A1A5C1"}
                                                    onChangeText={setSellerMessage}
                                                    value={sellerMessage}
                                                />
                                            </View>

                                            <TouchableOpacity disabled={loader} style={{ backgroundColor: '#8BC83F', borderRadius: 10, marginHorizontal: 20, marginTop: 10, alignItems: 'center', width: '60%', height: 46, justifyContent: 'center', alignSelf: 'center', marginBottom: 10 }} onPress={handleSellerForm}>
                                                {
                                                    loader ? <ActivityIndicator color={colours.white} />
                                                        : <FText fontSize='small' fontWeight='400' color={colours.white}>Send</FText>
                                                }
                                            </TouchableOpacity>


                                        </View>
                                    </View>
                                </Modal>

                            </View>

                            <View style={styles.clientView}>
                                <Image source={{ uri: estateDataObj[0]?.ListerImage }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                                <View style={{ marginLeft: 10 }}>
                                    <FText color={colours.primary} fontSize='large' fontWeight='700'>{estateDataObj[0]?.ListerName}</FText>
                                    <FText color={colours.typography_60} fontSize='normal' fontWeight='400' >Phone: {estateDataObj[0]?.ListerPhone}</FText>
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {ExtractAmenities()?.map((item, index) => (
                                        <View key={index} style={styles.btnPropertyStyle}>
                                            <FText color={colours.typography_60} fontSize='normal' fontWeight='400'>{item}</FText>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            <FText style={{ paddingHorizontal: '5%', marginTop: 40 }} fontSize='h6' fontWeight='700' color={colours.primary}>Location & Public Facilities</FText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: '5%' }}>
                                <Image source={Images.locationBg} style={{ width: 50, height: 50 }} />
                                <FText style={{ paddingHorizontal: '2%' }} fontSize='normal' fontWeight='400' color={colours.typography_60}>{estates[0].Location}, {estates[0].State}</FText>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {ExtractDescription()?.map((item, index) => (
                                        <View key={index} style={styles.btnPropertyStyle}>
                                            <FText fontSize='normal' fontWeight='400' color={colours.typography_60}>{item}</FText>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                                <FText fontSize='h6' fontWeight='700' color={colours.primary}>Cost of Rent</FText>

                            </View>
                            <View style={{ ...styles.clientView, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <FText fontSize='large' fontWeight='700' color={colours.typography_60} >$830/<FText fontSize='large' fontWeight='700' color={colours.typography_60}>month*</FText></FText>
                                <FText fontSize='small' fontWeight='400' color={colours.typography_60}>Contact listers for negotiation</FText>
                            </View>
                            <FText fontSize='h6' fontWeight='700' color={colours.primary} style={{ marginLeft: 20, marginTop: 20 }}>Reviews</FText>
                            {reviews.slice(0, 2).map(review => (
                                <ReviewCard
                                    key={review.id}
                                    name={review.userId}
                                    image={review.userImage}
                                    rating={review.rating}
                                    review={review.desc}
                                    date={new Date(review.createdAt).toLocaleString()}
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

                            {/* popup when favourite button is pressed */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={favModalVisible}
                                onRequestClose={() => {
                                    setFavModalVisible(!favModalVisible);
                                }}
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalView}>
                                        <FText fontSize="large" fontWeight="400" color={colours.typography_60}>
                                            Added to Favorites!
                                        </FText>
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
                            {/* <TouchableOpacity style={{ backgroundColor: '#8BC83F', borderRadius: 10, marginHorizontal: 20, marginVertical: 20, alignItems: 'center', width: '60%', height: 46, justifyContent: 'center', alignSelf: 'center' }}>
                            <FText fontSize='large' fontWeight='400' color={colours.white} >Submit</FText>
                        </TouchableOpacity> */}
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
            {favoriteLoader &&
                <View style={styles.lottieBox}>
                    <LottieView source={require('../assets/animations/like_animation.json')} style={{ height: 420, width: 420, bottom: 40 }} autoPlay loop />
                </View>
            }
        </>
    )
}

export default PropertyDetail

const propertyBtn = ['2 Bedroom', '1 Bathroom', '1 Parking']
const propertyBtn2 = ['2 Hospital', '4 Gas stations', '2 Schools']

export const ReviewCard = ({ name, image, rating, review, date }) => (
    <View style={styles.reviewView}>
        <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 20 }} />
        <View style={{ marginLeft: 10, width: '70%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <FText fontSize='large' fontWeight='700' color={colours.primary}>{name}</FText>
                <Rating
                    type='custom'
                    ratingCount={5}
                    imageSize={16}
                    ratingColor='#FDB54A'
                    startingValue={rating}
                    ratingBackgroundColor='#c8c7c8'
                    style={{ paddingVertical: 10 }}
                />
            </View>
            <FText fontSize='normal' fontWeight='400' color={colours.typography_60}>{review}</FText>
            <FText fontSize='small' fontWeight='400' color={colours.waterloo} style={{ marginVertical: 4 }}>{date}</FText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    bgImageContainer: {
        width: '100%',
        overflow: 'hidden',
        height: 360,
        alignSelf: 'center',
        borderRadius: 20,
        // marginTop: '8%',
        position: 'relative',
    },
    bgImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    heartBtn: {
        position: 'absolute',
        top: '14%',
        right: 6,
        zIndex: 999,
        height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    lottieBox: {
        position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
      },
    rowViewBgImg: {
        position: 'absolute',
        bottom: 36,
        left: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    tagView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#234F68',
        borderRadius: 20,
        width: 80,
        height: 36,
        justifyContent: 'center',
    },

    headingView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },

    divider: {
        height: 1,
        backgroundColor: '#53587A',
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
    },
    clientView: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        marginTop: 20,
        backgroundColor: '#F5F4F8',
        height: 100,
        borderRadius: 20,
    },
    btnPropertyStyle: {
        backgroundColor: '#F5F4F8',
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 20,
        paddingHorizontal: 20
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

    container: {
        padding: 10,
    },
    listingContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    listingText: {
        fontSize: 16,
        marginVertical: 5,
    },
    listerImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 100,
        height: 100,
        margin: 6,
    },
    inputContainer: {
        marginTop: 21,
        marginLeft: 20,
        marginRight: 30,
        marginBottom: 10
    },
    label: {
        marginBottom: 5
    },
    input: {
        height: 55,
        width: 250,
        borderColor: '#F4F5F8',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 16,
        backgroundColor: '#F4F5F8',
        color: colours.typography_80,
        fontFamily: fonts.LatoRegular,

    },
    textArea: {
        paddingTop: 10,
        height: 100,
        textAlignVertical: 'top'
    }
})
