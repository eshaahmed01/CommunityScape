import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import Icon from 'react-native-vector-icons/FontAwesome6'
import Icon2 from 'react-native-vector-icons/FontAwesome'

import React, { useState, useEffect } from 'react'

const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

const ReviewData = [{
    id: generateRandomId(),
    name: 'Esha Ahmed',
    image: 'https://insertface.com/fb/1579/man-short-hairstyle-round-1579015-syf5b-fb.jpg',
    review: 'Amazing location, friendly neighourhood. Convenient, lovely, My kids can play in the park and ride their bikes. ',
    date: Date.now()
},
{

   id: generateRandomId(),
   name: 'Mujtaba Tahir',
image: 'https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=',
review: 'Perfect location, i can cruise in my sonata all day, since i have nothing better to do',
date: Date.now()

}
,
{

    id: generateRandomId(),
    name: 'Mansoor Rehman',
 image: 'https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=',
 review: 'I have lived in hostel city, any place is better than that. SO IT ATE',
 date: Date.now()
 
 },
 {

    id: generateRandomId(),
    name: 'Jack Anderson',
 image: 'https://media.istockphoto.com/id/1483752333/photo/businessman-in-black-suit-posing-confidently-on-isolated-background-fervent.jpg?s=1024x1024&w=is&k=20&c=FmksyC-U0dR37DBfU0fsD0-BcGVgkNKiMWdMp8fqW9o=',
 review: 'Beautiful location, the hospital is nearby',
 date: Date.now()
 
 }


]

const Community = () =>{
    const [likedReviews, setLikedReviews] = useState({}); // Stores liked status for each review

    const handleLikePress = (reviewId) => {
        setLikedReviews((prevState) => ({
            ...prevState,
            [reviewId]: !prevState[reviewId] // Toggle the like status for the specific review
        }));
    };


const ReviewBox = ({ name, image, review, date , liked, onLikePress}) => (
    
       
    <View style={styles.reviewView}>
        <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 50, marginLeft: 20 }} />
        <View style={{ marginLeft: 10, width: '70%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <FText fontSize='large' fontWeight='700' color={colours.primary}>{name}</FText>
                
            </View>
            <FText fontSize='normal' fontWeight='700' color={colours.waterloo} style={{marginTop: 8}}>{review}</FText>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}> 
            <FText fontSize='small' fontWeight='400' color={colours.waterloo} style={{ marginVertical: 4 }}>{date}</FText>
            <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={onLikePress}>
                            {/* Like icon (turns red when liked) */}
                            <Icon2 
                                name="heart" 
                                size={24} 
                                color={liked ? 'red' : 'gray'} 
                                style={styles.iconStyle} 
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => { /* Handle comment action */ }}>
                            {/* Comment icon */}
                            <Icon 
                                name="comment" 
                                size={24} 
                                color="gray" 
                                style={styles.iconStyle} 
                            />
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
        
                </View>
    
);





   return (
   
        <ScrollView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <BackButton> </BackButton>
                   
                </View>
                 
                 <View style={{flexDirection: 'row'}}> 
                <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{marginTop: 20, marginLeft: 15}}> Welcome to Community! </FText>
                <Icon name="hands-clapping" size={40} color='#E4D00A' style={{marginTop: 15}}/>
                </View>
                <FText fontSize='large' fontWeight='400' color={colours.primary} style={{marginTop: 2, marginLeft: 20}}> Catch up on latest updates and posts </FText>
                </View>

                {ReviewData.map(review => (
                            <ReviewBox
                                key={review.id}
                                name={review.name}
                                image={review.image}
                                review={review.review}
                                date={new Date(review.date).toLocaleString()}
                                liked={likedReviews[review.id]}
                                onLikePress={() => handleLikePress(review.id)}
                            />
                        ))}

        </ScrollView>
   )
   

}

export default Community;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:colours.secondary
    },
    headerView: {
        flexDirection: "row",
        marginTop: 21,
        height: 104,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    
    
    
    backImg: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
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
    iconStyle: {
        marginLeft: 20, // Space between icons
    }
})