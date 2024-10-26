
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BackButton from '../components/BackButtons';
import FText, { FontWeights } from '../components/Ftext';
import { colours } from '../constants/colours';
import apartment from '../assets/images/apartment.jpeg';
import house from '../assets/images/house.jpeg';
import Building from '../assets/images/building.jpeg';
import Land from '../assets/images/land.jpeg';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import LocationSetupScreen from './map';

const CategoryTile = ({location, onPress, isSelected}) => {

    // const navigation = useNavigation();

    // const handlePress = () => {
    //   navigation.navigate('LocationDetails');
    // };


        return (
          <TouchableOpacity  onPress={onPress} style={[styles.itemContainer, isSelected && styles.selectedTile]} >
            <Image source={location.image} style={styles.image} />
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{`#${location.number}`}</Text>
            </View>
            <FText  color= {colours.typography_60} fontSize= "small" style={[styles.locationName, isSelected && styles.selectedText]}>{location.name}</FText>
          </TouchableOpacity>
        );
      };

      


const Category = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const navigation = useNavigation();

 
    const categories = [
        { number: 1, name: 'Apartment', image: apartment },
        {number: 2, name: 'House', image: house},
        {number: 3, name: 'Land', image: Land},
        {number: 4, name: 'Building', image: Building}
             
    ]

    const handlePress = (item) => {
        setSelectedItem(item.number);
        navigation.navigate('HomeTab');

      };

    
    return(
    <ScrollView> 
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
        <BackButton/>
        <TouchableOpacity style={styles.button} > 
        <FText  color='#333'  fontSize='small' style={styles.ButtonText}> Skip </FText>
         </TouchableOpacity>
        </View>
        <FText color={colours.typography_60} fontSize='h4' style={styles.heading}> Select your real estate </FText>
        <FText color={colours.typography_60} fontSize='h4' style={styles.heading2}> type </FText>
        <FText color={colours.typography_60} fontSize='small' style={{marginLeft: 30}}> You can edit this later on your account setings </FText>

<View style={{ marginHorizontal: '4%', marginTop: 20 }}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.number.toString()}
                    renderItem={({ item }) => <CategoryTile location={item} isSelected={selectedItem === item.number} onPress={() => handlePress(item)}

                        // onPress={() => navigation.navigate('LocationDetails', { name: item.name, image: item.image,num: item.number })}
                    />}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </View>

            <TouchableOpacity  onPress={navigation.navigate('HomeTab')} style={{ height: 63, width: '80%', alignSelf: "center", alignItems: "center", justifyContent: 'center', backgroundColor: '#8BC83F', borderRadius:20, marginTop:10 }}>
                    <FText color='white' fontSize='normal'>Next </FText>
                </TouchableOpacity>
                <View style={{ height: 20 }} />

        
    </ScrollView>
    )
}

export default Category;

const styles = StyleSheet.create({
    heading: {
        fontWeight:500,
        marginTop: 30,
        marginLeft: 20
    },
    heading2: {
        fontWeight:500,
        marginLeft: 20
    },

    button : {
            backgroundColor: '#E8E8E8',
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginLeft: 300,
            marginTop: 50
          }, 
    ButtonText: {
            
            fontSize: 16,
            fontWeight: '600',
          },
    
    tilesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        marginLeft: 20,
        width: "50%",
        marginRight: 30
        
      },
    
        itemContainer: {
          flex: 1,
          margin: 8,
          backgroundColor: '#E8E8E8',
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
          elevation: 3, // for Android shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },

        selectedTile : {
            backgroundColor: colours.typography_60

        },
        image: {
          width: '90%',
          height: 150,
          borderRadius: 20
        },
        numberBadge: {
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: '#7DCE82',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        numberText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
        },
        locationName: {
          marginVertical: 8,
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginLeft:-70
        },
        selectedText : {
            color: 'white'
        }
      });
      
  


