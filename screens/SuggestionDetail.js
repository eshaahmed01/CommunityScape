import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colours } from '../constants/colours'
import { Rating } from 'react-native-ratings';
import BackButton from '../components/BackButtons';
import FText from '../components/Ftext';
import { db } from "../firebaseconfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp } from "firebase/firestore";
import HorizontalImageCarousel from '../components/HorizontalImageCarousel';
import fonts from '../constants/fonts';

const SuggestionDetail = ({ route, navigation }) => {

    const [estates, setEstates] = useState([]);
    const [estateDetails, setEstateDetails] = useState({});
    const [estateDataObj, setEstateDataObj] = useState({});
    const [favModalVisible, setFavModalVisible] = useState(false);
    
  

   
const LocationData = {
    Images : [
        'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    propertyType: 'House',
    State: 'Washington,DC',
    Type: 'House',
    Price: 236000,
    ListedBy : {
        name: 'Antoine Johnson',
        Phone: '410-995-8386',
        ProfileImage: 'https://insertface.com/fb/1579/man-short-hairstyle-round-1579015-syf5b-fb.jpg'
    },
    Amenities : [
        '2 Hospitals',
        '3 gas Stations',
        '1 Mall',
        '3 Schools',
        '2 Gyms'
    ],
    Rent: 1500,
    Location: '990 Rookus Drive'
}

    const handleFavourites = () => {
        setFavModalVisible(true);

        setTimeout(() => {
            setFavModalVisible(false);
        }, 1000);
        // navigation.navigate('Favourites', location);
    }


    const splitEstateName = (location) => {
        const words = location.split(' ');
        const lastWord = words.pop();
        const remainingText = words.join(' ');

        return { remainingText, lastWord };
    };

    // const { remainingText, lastWord } = splitEstateName(name);

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

    return (

        <SafeAreaView style={styles.mainContainer}>
           
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContainer}>
                        <BackButton />
                        <View style={styles.bgImageContainer}>
                            <HorizontalImageCarousel images={LocationData.Images} />
                           
                            <TouchableOpacity style={styles.heartBtn} onPress={handleFavourites}>
                                <Image source={Images.heart} style={{ width: 40, height: 40 }} />
                            </TouchableOpacity>

                            <View style={styles.rowViewBgImg}>
                                <View style={{ ...styles.tagView, marginLeft: -10, width: 90 }}>
                                    <FText style={styles.bodyText} fontSize='normal' fontWeight='400' color={colours.white}>{LocationData.Type}</FText>
                                </View>
                            </View>
                        </View>
                        {/* <EstateDetails estateDetails={estateDetails} /> */}
                        
                        <View style={styles.headingView}>
                             
                                <FText style={styles.headingText} fontSize='h5' fontWeight='900' color={colours.primary}>{LocationData.propertyType}</FText>
                            <FText style={styles.headingText} fontSize='h5' fontWeight='900' color={colours.primary}>${LocationData.Price.toLocaleString()}{" "}</FText>
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 11 }}>
                            <Image source={Images.location} style={{ width: 20, height: 20 }} resizeMode='contain' />
                            <FText style={{ ...styles.bodyText, color: '#53587A', marginLeft: 5 }} fontSize='normal' fontWeight='400' color={colours.typography_60}>{LocationData.State}</FText>
                        </View>

                        <View>
                            <FText style={{ paddingHorizontal: '5%', marginTop: 40 }} fontSize='h6' fontWeight='700' color={colours.primary}>Listed By</FText>
                        </View>
                        
                        <View style={styles.clientView}>
                            <Image source={{uri: LocationData.ListedBy.ProfileImage }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 10 }}>
                                <FText color={colours.primary} fontSize='large' fontWeight='700'>{LocationData.ListedBy.name}</FText>
                                <FText color={colours.typography_60} fontSize='normal' fontWeight='400' >Phone: {LocationData.ListedBy.Phone}</FText>
                            </View>
                        </View>

                       

                        <FText style={{ paddingHorizontal: '5%', marginTop: 40 }} fontSize='h6' fontWeight='700' color={colours.primary}>Location & Public Facilities</FText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: '5%' }}>
                            <Image source={Images.locationBg} style={{ width: 50, height: 50 }} />
                            <FText style={{ paddingHorizontal: '2%' }} fontSize='normal' fontWeight='400' color={colours.typography_60}>{LocationData.Location}, {LocationData.State}</FText>
                        </View>
                        <View style={{ marginTop: 20 }}></View>

                        <View style={{ marginTop: 20 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {LocationData.Amenities.map((item, index) => (
                                    <View key={index} style={styles.btnPropertyStyle}>
                                        <FText color={colours.typography_60} fontSize='normal' fontWeight='400'>{item}</FText>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                            <FText fontSize='h6' fontWeight='700' color={colours.primary}>Cost of Rent</FText>
                           
                        </View>
                        <View style={{ ...styles.clientView, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <FText fontSize='large' fontWeight='700' color={colours.typography_60} >${LocationData.Rent}/<FText fontSize='large' fontWeight='700' color={colours.typography_60}>month*</FText></FText>
                            <FText fontSize='small' fontWeight='400' color={colours.typography_60}>Contact listers for negotiation</FText>
                        </View>

                        
                        
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


                        <TouchableOpacity style={{ backgroundColor: '#8BC83F', borderRadius: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center', width: '60%', height: 46, justifyContent: 'center', alignSelf: 'center', marginBottom: 20 }} onPress={()=> navigation.navigate('Community')} >
                            <FText fontSize='large' fontWeight='400' color={colours.white}>View Community </FText>
                        </TouchableOpacity>
                        
                    </View>
                </ScrollView>
        
        </SafeAreaView>

    )
}

export default SuggestionDetail

const propertyBtn = ['2 Bedroom', '1 Bathroom', '1 Parking']
const propertyBtn2 = ['2 Hospital', '4 Gas stations', '2 Schools']

// export const ReviewCard = ({ name, image, rating, review, date }) => (
//     <View style={styles.reviewView}>
//         <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 20 }} />
//         <View style={{ marginLeft: 10, width: '70%' }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <FText fontSize='large' fontWeight='700' color={colours.primary}>{name}</FText>
//                 <Rating
//                     type='custom'
//                     ratingCount={5}
//                     imageSize={16}
//                     ratingColor='#FDB54A'
//                     startingValue={rating}
//                     ratingBackgroundColor='#c8c7c8'
//                     style={{ paddingVertical: 10 }}
//                 />
//             </View>
//             <FText fontSize='normal' fontWeight='400' color={colours.typography_60}>{review}</FText>
//             <FText fontSize='small' fontWeight='400' color={colours.waterloo} style={{ marginVertical: 4 }}>{date}</FText>
//         </View>
//     </View>
// );

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
})
