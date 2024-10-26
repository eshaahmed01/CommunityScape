import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image
    
    
  } from "react-native";
  import React, { useState, useEffect, useRef, lazy } from "react";
  import FText from "../components/Ftext";
  import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import fonts from "../constants/fonts";

const Images = [
    'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ]
   

const NearByCard = ({data, navigation}) => (
    <TouchableOpacity
    style={styles.nearByView}>
      <Image
        source={{uri: data}}
        style={styles.nearByImg}
      />
      <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('SuggestionDetail')}>
         <FText fontSize="large" fontWeight={900} color={colours.secondary}> View Details </FText>
        </TouchableOpacity>
    </TouchableOpacity>
  );

const LocationSuggestions = ({ navigation }) => {

    
        return (
            <ScrollView style={styles.mainContainer}>
               
        <BackButton> </BackButton>
          <View> 
         <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{marginTop: 120, marginLeft: 30}} >
        Location Suggestions
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 30}}> We have the following suggestions for you!</FText>
        </View>

        <FlatList
        data={Images}
        renderItem={({ item }) => (
          <NearByCard data={item} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />

</ScrollView>   
 )

}

export default LocationSuggestions;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    nearByView: {
        width: "90%",
        height: 340,
        backgroundColor: "#F5F4F8",
        borderRadius: 20,
        marginTop: 20,
        marginLeft: 20
      },
      nearByImg: {
        width: "100%",
        height: "86%",
        alignSelf: "center",
        resizeMode: "contain"
      
      },
      button: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        backgroundColor: colours.primary,
        width: '80%',
        alignSelf: 'center'
        
    },
})
