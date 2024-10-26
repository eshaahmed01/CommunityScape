import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, FlatList, ScrollView } from 'react-native';
import BackButton from '../components/BackButtons';
import FText, { FontWeights } from '../components/Ftext';
import { colours } from '../constants/colours';
import LocationTile from '../components/LocationTile';
import { useNavigation } from '@react-navigation/native';

// Import local images
import Chicago from '../assets/images/Chicago.jpeg';
import Miami from '../assets/images/miami.jpeg';
import NewYork from '../assets/images/NewYork.jpeg';
import LasVegas from '../assets/images/LasVegas.jpeg';
import LA from '../assets/images/LA.jpeg';
import Washington from '../assets/images/Washington.jpeg';

const ImgPath = "../assets/images/Home/";

const TopLocations = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const locations = [
        { number: 1, name: 'Chicago, IL', image: 'https://media.gettyimages.com/id/1180689542/photo/chicago-aerial-cityscape-at-sunrise.webp?s=612x612&w=gi&k=20&c=NoWbPvqQJ4fHGFFcdN5TZU3ANmlTPOVizNitu322I3I=' },
        { number: 2, name: 'Miami, FL', image: 'https://i.natgeofe.com/n/5de6e34a-d550-4358-b7ef-4d79a09c680e/aerial-beach-miami-florida.jpg?w=2560&h=1706' },
        { number: 3, name: 'Brooklyn, NY', image: NewYork },
        { number: 4, name: 'Las Vegas, NV', image: LasVegas },
        { number: 5, name: 'Los Angeles, CA', image: LA },
        { number: 6, name: 'Washington DC', image: Washington },
        { number: 7, name: 'Phoenix, AZ', image: Washington },
        { number: 8, name: 'Detroit, MI', image: Washington },
        { number: 9, name: 'San Francisco, CA', image: Washington },
        { number: 10, name: 'Madison, WI', image: Washington },
        { number: 11, name: 'San Diego, CA', image: Washington },
        { number: 12, name: 'Phoenix, AZ', image: Washington },
        { number: 13, name: 'Salt Lake City, UT', image: Washington },
        { number: 14, name: 'Grand Rapids, MI', image: Washington },
        { number: 15, name: 'Kansas City, MO', image: Washington },
        { number: 16, name: 'Minneapolis, MN', image: Washington },
    ];

    const filteredLocations = locations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView>
            <BackButton />
            <FText color={colours.typography_60} fontSize='h3' fontWeight="900" style={styles.heading}>All Locations</FText>
            <FText color={colours.typography_60} fontSize='small' fontWeight="400" style={{ marginLeft: 30 }}>Find the best places to live</FText>

            <View style={styles.searchView}>
                <Image
                    source={require(ImgPath + "search.png")}
                    style={{ width: 20, height: 20 }}
                />
                <TextInput
                    placeholder="Search House, Apartment, etc"
                    placeholderTextColor={"#A1A5C1"}
                    style={{ flex: 1, marginLeft: 10 }}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>

            <View style={{ marginHorizontal: '4%', marginTop: 20 }}>
                <FlatList
                    data={filteredLocations}
                    keyExtractor={(item) => item.number.toString()}
                    renderItem={({ item }) => (
                        <LocationTile 
                            location={item}
                            onPress={() => navigation.navigate('LocationDetails', { name: item.name, image: item.image, num: item.number })}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </View>
        </ScrollView>
    );
}

export default TopLocations;

const styles = StyleSheet.create({
    heading: {
        marginTop: 120,
        marginLeft: 20
    },
    tilesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        marginLeft: 20,
        width: "50%",
        marginRight: 30
    },
    searchView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5E4E2",
        height: 60,
        width: '90%',
        borderRadius: 15,
        marginTop: 20,
        paddingHorizontal: 10,
        zIndex: -1,
        marginLeft: 20
    },
    listContent: {
        paddingHorizontal: '4%',
        marginTop: 20
    }
});
