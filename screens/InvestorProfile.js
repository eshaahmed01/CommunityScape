import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';



const InvestorProfile = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(1000)).current;

const [amount, setAmount] = useState(0);
const[open2, setOpen2] = useState(false);
const[open3, setOpen3] = useState(false);
const [profit, setProfit] = useState(0);
const [ propertyType, setPropertyType] = useState(null);
const [ time, setTime] = useState(null);
const [risk, setRisk] = useState(null);
const [open, setOpen] = useState(false);
const navigation = useNavigation();

const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
    }).start();
  };
  
  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: 300,
      useNativeDriver: true,
      tension: 20,
    }).start(() => setModalVisible(false));

    navigation.navigate('InvestorProperty')
  
    
  };

const handleSubmit = () => {
    if (!amount) {
        alert("Please select the principal amount.");
        return;
     }

     if (amount < 100000) {
        alert("Amount must be at least 100,000.");
        return;
    }

    if (profit < 1000) {
        alert("Profit must be at least 1,000.");
        return;
    }
    
     if (!propertyType) {
        alert("Please select the property type.");
        return;
     }

     if (!profit) {
        alert("Please select the profit.");
        return;
     }

     if (!time) {
        alert("Please select the time.");
        return;
     }

     if (!risk) {
        alert("Please select the risk tolerance.");
        return;
     }
     openModal();


   
}
    return (
        <ScrollView style={styles.mainContainer}>
            <View style={{marginTop: 50, marginLeft: 20}}>
            <FText fontSize="h6" fontWeight={700} color={colours.primary} >
          Create your investment profile
           </FText>

           <FText fontSize="large" fontWeight={400} color={colours.primary} >
          Please fill out all the details to see best results!
           </FText>

           <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
           Principal Amount 
        </FText>
        <TextInput
          style={styles.input}
          placeholder="Enter in $"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setAmount}
          value={amount}
        />
      </View>

      <View style={{marginLeft: -15}} >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
             Property Type:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Land", value: "Land" },
                        { label: "House", value: "House" },
                        { label: "Apartment", value: "Apartment" }
                        
                      ]}
                        open={open}
                        value={propertyType}
                        setOpen={setOpen}
                        setValue={setPropertyType}
                        onChangeValue={setPropertyType}
                        placeholder="Select property Type"
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
          Expected Profit
        </FText>
        <TextInput
          style={styles.input}
          placeholder="Enter in $"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setProfit}
          value={profit}
        />
      </View>

      <View style={{marginLeft: -15}} >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Investment Time Horizon:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Short term", value: "Short term" },
                        { label: "Long term", value: "Long term" },
                        { label: "Mid term", value: "Mid term" }
                        
                      ]}
                        open={open2}
                        value={time}
                        setOpen={setOpen2}
                        setValue={setTime}
                        onChangeValue={setTime}
                        placeholder="Select appropriate time"
                        placeholderTextColor={"#A1A5C1"}
                        style={styles.dropdown}
                        textStyle={styles.text}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.listItemLabelStyle}
                    />
                </View>
        </View>

        <View style={{marginLeft: -15}} >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Risk tolerance:
          </FText>

          <View style={styles.dropdownContainer2}>
                    <DropDownPicker
                    items ={[
                        { label: "Low", value: "Low" },
                        { label: "Medium", value: "Medium" },
                        { label: "High", value: "High" }
                        
                      ]}
                        open={open3}
                        value={risk}
                        setOpen={setOpen3}
                        setValue={setRisk}
                        onChangeValue={setRisk}
                        placeholder="Select appropriate option"
                        placeholderTextColor={"#A1A5C1"}
                        style={styles.dropdown}
                        textStyle={styles.text}
                        dropDownContainerStyle={styles.dropdownList}
                        listItemLabelStyle={styles.listItemLabelStyle}
                    />
                </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <FText fontSize="large" fontWeight={700} color={colours.white}> 
            Submit
        </FText>
         </TouchableOpacity>

         <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >

     <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>
            
            <View style={{alignItems: 'center'}}> 
              <Image source={require('../assets/svg/Success.png')}/>
           
            <FText fontSize='h6' fontWeight={700} color={colours.primary}> Profile successfully </FText>
            <FText fontSize='h6' fontWeight={900} color={colours.primary}> created </FText>
             </View>
            <Pressable style={[styles.button, styles.buttonClose]} 
             onPress={() => {
              closeModal();
              

            }}
            >
              <FText fontSize='normal' fontWeight={700} color={colours.secondary} > Finish </FText>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
         



               </View>
               </ScrollView>
    )

}

export default InvestorProfile;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:colours.secondary
    },
    inputContainer: {
        marginTop: 21,
        marginLeft: 15,
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
    button: {
        backgroundColor: '#8BC83F',
         height: 50,
         width: '70%',
         marginTop: 20,
         alignItems: 'center',
         justifyContent: 'center',
         borderRadius: 10,
         marginBottom: 20,
         alignSelf: 'center'
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
      },
      modalView: {
        marginTop: 'auto',
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }
    })