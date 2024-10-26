import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Button,
    Animated,
    Pressable,
    Modal, SafeAreaView
  } from "react-native";
  import React, { useState, useEffect, useRef, lazy } from "react";
  import FText from "../components/Ftext";
  import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from "../constants/fonts";
import { useNavigation } from '@react-navigation/native';


const ArchitecturalDetails = () => {
  const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const[open2, setOpen2] = useState(false);
    const[open3, setOpen3] = useState(false);
    const[open4, setOpen4] = useState(false);
    const[open5, setOpen5] = useState(false);
    const [architecturalStyle, setArchitecturalStyle] = useState(null);
    const [floorPlan, setFloorPlan] = useState(null);
    const [ numberOfFloors, setNumberOfFloors] = useState(null);
    const [bedrooms,setBedrooms] = useState(null);
    const[ bathrooms, setBathrooms] = useState(null);
    const [homeSize, setHomeSize] = useState(null);
    const[extraDetail, setExtraDetail] = useState(null);


const handleSubmit = () =>{

  if (!architecturalStyle) {
    alert("Please select an architectural style.");
    return;
  }
  if (!floorPlan) {
    alert("Please select a floor plan.");
    return;
  }
  if (!numberOfFloors) {
    alert("Please select the number of floors.");
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
  if (!bedrooms) {
    alert("Please select the number of bedrooms.");
    return;
  }
  if (!bathrooms) {
    alert("Please select the number of bathrooms.");
    return;
  }
  if (extraDetail && typeof extraDetail !== "string") {
    alert("Extra detail must be a valid string.");
    return;
  }
  
  console.log(architecturalStyle);
console.log(floorPlan);
console.log(numberOfFloors)
console.log(homeSize);
console.log(bedrooms);
console.log(bathrooms);
console.log(extraDetail)

navigation.navigate('HomeModels', {
  architecturalStyle, 
  floorPlan, 
  numberOfFloors, 
  homeSize, 
  bedrooms, 
  bathrooms, 
  extraDetail
});




}

    
    return (
    
        <ScrollView style={styles.mainContainer}>
           
            <BackButton> </BackButton>
              <View> 
             <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{marginTop: 120, marginLeft: 30}} >
              Select your Details
            </FText>
            <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 30}}> All Details must be selected to view relevant home models</FText>
            </View>

            <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Choose Architectural Style:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Modern", value: "Modern" },
                        { label: "Colonial", value: "Colonial" },
                        
                      ]}
                        open={open}
                        value={architecturalStyle}
                        setOpen={setOpen}
                        setValue={setArchitecturalStyle}
                        onChangeValue={setArchitecturalStyle}
                        placeholder="Select Architectural Style"
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
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Choose Floor Plan:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Open", value: "Open" },
                        { label: "Segmented", value: "Segmented" },
                        
                      ]}
                        open={open2}
                        value={floorPlan}
                        setOpen={setOpen2}
                        setValue={setFloorPlan}
                        onChangeValue={setFloorPlan}
                        placeholder="Select floor plan"
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
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Number of Floors:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Single Story", value: "Single Story" },
                        { label: "Multi Story", value: "Multi Story" },
                        
                      ]}
                        open={open3}
                        value={numberOfFloors}
                        setOpen={setOpen3}
                        setValue={setNumberOfFloors}
                        onChangeValue={setNumberOfFloors}
                        placeholder="Single/Multi Story"
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

      <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 20, marginLeft: 28 }}
          >
            Bedrooms:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                       
                      ]}
                        open={open4}
                        value={bedrooms}
                        setOpen={setOpen4}
                        setValue={setBedrooms}
                        onChangeValue={setBedrooms}
                        placeholder="Select number of bedrooms"
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
            style={{ marginBottom: -40, marginTop: 20, marginLeft: 28 }}
          >
            Bathrooms:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                       
                      ]}
                        open={open5}
                        value={bathrooms}
                        setOpen={setOpen5}
                        setValue={setBathrooms}
                        onChangeValue={setBathrooms}
                        placeholder="Select number of bathrooms"
                        placeholderTextColor={"#A1A5C1"}
                        style={styles.dropdown}
                        textStyle={styles.text}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.listItemLabelStyle}
                    />
                </View>
        </View>

        <View style={styles.inputContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Extra detail: 
        </FText>

        <FText fontSize="large" fontWeight={700} color="#A1A5C1" style={styles.label}>
          Optional
        </FText>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Backyard, Garden, Pool etc"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setExtraDetail}
           value={extraDetail}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <FText fontSize="large" fontWeight={700} color={colours.white}> 
            Submit
        </FText>
         </TouchableOpacity>


           </ScrollView>

    )
}

export default ArchitecturalDetails;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    dropdownContainer: {
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
      },
      dropdownContainer2: {
        marginTop: 50,
        paddingHorizontal: 30,
       
        
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
    inputContainer: {
        marginTop: 21,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10
      },
      label: {
        marginBottom: 5
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

}
)