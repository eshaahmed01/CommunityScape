import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput
    
    
  } from "react-native";
  import React, { useState, useEffect, useRef, lazy } from "react";
  import FText from "../components/Ftext";
  import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import fonts from "../constants/fonts";
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const LocationForm = () => {
  const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    const [propertyType, setPropertyType] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [minPriceRange, setMinPriceRange] = useState(null);
    const [maxPriceRange, setMaxPriceRange] = useState(null);
    const [transportation, setTranportation] = useState(null);

    const [homeSize, setHomeSize] = useState(null);
    

  const amenities = ['Hospital', 'School', 'Park'];

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  console.log(selectedAmenities);

  const handleSubmit = () =>{

    if (!propertyType) {
      alert("Please select a property type.");
      return;
    }
    if (!selectedAmenities) {
      alert("Please select the amnenities.");
      return;
    }
    if (!minPriceRange) {
      alert("Please select the min price range.");
      return;
    }
    if (!homeSize || isNaN(homeSize)) {
      alert("Please enter a valid home size in sqft.");
      return;
    }
    if (homeSize.length > 4) {
      alert("Home size should not exceed 4 digits.");
      return;
    }
    if (!maxPriceRange) {
      alert("Please select the max price range.");
      return;
    }
    navigation.navigate("LocationSuggestions")

    
  }
    return (
        <ScrollView style={styles.mainContainer}>
           
    <BackButton> </BackButton>
      <View> 
     <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{marginTop: 120, marginLeft: 25}} >
    Location Preference Details
    </FText>
    <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 25}}> Tell us what are you looking for? </FText>
    </View>

    <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Choose Property type:
          </FText>

    <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "House", value: "House" },
                        { label: "Land", value: "Land" },
                        { label: "Apartment", value: "Apartment" },
                     

                        
                      ]}
                        open={open}
                        value={propertyType}
                        setOpen={setOpen}
                        setValue={setPropertyType}
                        onChangeValue={setPropertyType}
                        placeholder="Select property type"
                        placeholderTextColor={"#A1A5C1"}
                        style={styles.dropdown}
                        textStyle={styles.text}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.listItemLabelStyle}
                    />
                </View>
        </View>

        <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: 10, marginTop: 30, marginLeft: 28 }}
          >
            Choose amenities:
          </FText>
          
          {amenities.map((amenity, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <FText fontSize="small" fontWeight={700} style={styles.checkboxLabel}>{amenity}</FText>
          <TouchableOpacity
            style={styles.customCheckbox}
            onPress={() => toggleAmenity(amenity)}
          >
            {selectedAmenities.includes(amenity) ? (
              <FontAwesome name="check-square" size={30} color="green" />
            ) : (
              <FontAwesome name="square-o" size={30} color="gray" />
            )}
          </TouchableOpacity>
          
        </View>
          
        ))}
        </View>

        <View style={styles.inputContainer}>
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: 10, marginTop: 30, marginLeft: 5 }}
          >
            Choose price range:
          </FText>
          <View style={{flexDirection:'row' }}> 
          <TextInput
          style={styles.input}
          placeholder="For eg $5000"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setMinPriceRange}
           value={minPriceRange}
        />
        <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{  marginTop: 15, marginLeft: 15, marginRight: 15 }}
          >
            to
          </FText>
          <TextInput
          style={[styles.input, {width: '40%'}]}
          placeholder="For eg $5000"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setMaxPriceRange}
           value={maxPriceRange}
        />

        </View>
          </View>

          <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Availability of public Transportation:
          </FText>

    <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },

                      ]}
                        open={open2}
                        value={transportation}
                        setOpen={setOpen2}
                        setValue={setTranportation}
                        onChangeValue={setTranportation}
                        placeholder="Select an option"
                        placeholderTextColor={"#A1A5C1"}
                        style={styles.dropdown}
                        textStyle={styles.text}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.listItemLabelStyle}
                    />
                </View>
        </View>

        <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Enter your preferred home size
        </FText>
        <TextInput
          style={styles.input}
          placeholder="Enter in sqft"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setHomeSize}
          value={homeSize}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} >
        <FText fontSize="large" fontWeight={700} color={colours.white}> 
            Submit
        </FText>
         </TouchableOpacity>
          </ScrollView>


    )

}

export default LocationForm;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary,
        marginBottom: 30
    },
    dropdownContainer2: {
        marginTop: 50,
        paddingHorizontal: 30,
        marginLeft: -10
       
        
    },
    dropdown: {
        backgroundColor: "#F5F4F8",
        borderColor: colours.primary,
        fontFamily:fonts.LatoRegular,
        borderColor: '#F4F5F8',
        borderWidth: 1,
        zIndex: 1000
        
    },
    dropdownList: {
     borderColor: "#A1A5C1" ,

    },
    text : {
        fontFamily:fonts.LatoRegular,
        fontSize: 18,
        color: "#A1A5C1"
    },
    listItemLabelStyle: {
        backgroundColor: '#F4F5F8',
        color: colours.primary,
        fontFamily: fonts.LatoBold
        
    },
    checkboxContainer: {
    
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '40%',
      marginBottom: 10,
      marginLeft: 30

    },
    customCheckbox: {
      marginRight: 10,
      marginLeft: 10,
      
    },
    checkboxLabel: {
      fontSize: 20,
      fontFamily: fonts.LatoBold,
      color: '#1D3557',
    },

    inputContainer: {
      marginTop: 21,
      marginLeft: 20,
      marginRight: 30,
      marginBottom: 10
    },
    label: {
      marginBottom: 5,
      marginLeft: 5
    },
    input: {
      height: 55,
      borderColor: '#F4F5F8',
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 10,
      fontSize: 16,
      backgroundColor: '#F4F5F8',
      color: colours.typography_80,
      fontFamily:fonts.LatoRegular,
      
    },
    button: {
      backgroundColor: '#8BC83F',
       height: 50,
       width: '80%',
       marginTop: 20,
       alignItems: 'center',
       justifyContent: 'center',
       borderRadius: 10,
       marginBottom: 20,
       alignSelf: 'center'
    },
})