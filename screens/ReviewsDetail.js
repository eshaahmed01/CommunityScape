import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import { colours } from '../constants/colours'
import { ReviewCard } from './PropertyDetail'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'

const ReviewsDetail = ({ navigation, route }) => {


    const { reviews } = route.params

    const renderReview = ({ item }) => (
        <ReviewCard
            key={item.id}
            name={item.userId}
            image={item.userImage}
            rating={item.rating}
            review={item.desc}
             date={new Date(item.createdAt).toLocaleString()}
        />
    )
    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <BackButton> </BackButton>
                    <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{marginTop: 30}}>Reviews</FText>
                    
                </View>
                <View style={{marginTop: 20, marginBottom: 10}}> 
                <FlatList
                    data={reviews}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReview}
                />
                </View>
            </View>
        </ScrollView>
    )
}

export default ReviewsDetail

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:colours.secondary
    },
    headerView: {
        flexDirection: "row",
        marginTop: 20,
        height: 104,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    
    
    
    backImg: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    }
})