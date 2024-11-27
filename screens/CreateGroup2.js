import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButtons'
const ImgPath = "../assets/images/Home/";
import Icons from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from 'react-native-vector-icons';


const CreateGroup2 = () => {
  const navigation = useNavigation();

    const [groupName, setGroupName] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [imageAdded, setImageAdded] = useState(false); // State to control the green popup

    const Images = [{
       image:  require(ImgPath + "personImg.png")},
        {image: require(ImgPath + "personImg.png")},
        {image: require(ImgPath + "personImg.png")},

    ]

    const [ images, setImages] = useState(Images)

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setProfilePic(result.assets[0].uri);
        }
      };

      const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
      };
      
      
    return (
        <ScrollView style={styles.mainContainer}>
        <BackButton />
        <View style={{alignItems: 'center'}}>
          <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 100,}}>
          Add Group Description
          </FText>
          </View>

          <View  style={styles.inputContainer}>


            <TouchableOpacity style= {styles.iconContainer} onPress={handleImagePicker}> 
            <Image source={profilePic
              ? { uri: profilePic } 
              :  require('../assets/images/Profile/camera.png') } 
               style={ profilePic && {
                width: 50,  // Set width
                height: 50,  // Set height
                borderRadius: 25,  // Make the image circular
                resizeMode: 'cover'  // Ensure the image covers the entire area
              } 
              }/>
            </TouchableOpacity>


            <TextInput
               style={styles.input}
               placeholder="Group Name"
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setGroupName}
               value={groupName}
               />
             </View>

             <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 20, marginLeft: 40}}> 
            <View style={styles.optionIcon}> 
            <FontAwesome6 name="user-group" size={25} color={colours.primary} />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Members </FText>
         
          </View>

          <View  style={[styles.imageContainer, Images.length > 0 && styles.imagesConatiner]}> 
          {images.map((item, index) => (
  <View key={index} style={styles.imageWrapper}>
    <Image source={item.image} style={styles.previewImage} />
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => handleRemoveImage(index)}
    >
      <Ionicons name="close-circle" size={18} color="red" />
    </TouchableOpacity>
          </View>
          ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GroupDetails')} >
          <FText fontSize="small" fontWeight={700} color={colours.white}>
            Create
          </FText>
        </TouchableOpacity>
        </ScrollView>
          


          

    )

}


export default CreateGroup2;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    inputContainer: {
        flexDirection: 'row',    // Align icon and TextInput in a row
        alignItems: 'center',    // Center items vertically
        backgroundColor: '#F5F4F8', // Light background color
           // Padding inside the container
        height: 70, 
        marginTop: 21,
          marginLeft: 30,
          marginRight: 30,
        padding: 20,
        borderRadius: 20
          
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
   
      iconContainer: {
        width: 50, // Ensures a square shape
        height: 50, // Ensures a square shape
        borderRadius: 25, // Half of width/height to make it circular
        borderWidth: 2,
        borderColor: colours.waterloo, // Adjust to your primary color
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.8
      },

      imageContainer : {
        height: 150,
        backgroundColor: '#F4F5F8',
        width: '90%',
        marginLeft: 5,
        marginTop: 5, 
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
      },
      imagesConatiner : {
        flexDirection: 'row',
        height: 150,
        backgroundColor: '#F4F5F8',
        width: '90%',
        marginLeft: 20,
        marginTop: 5, 
        marginBottom: 20,
        borderRadius: 10
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
      textArea: {
        paddingTop: 10,
        height: 150,
        textAlignVertical: 'top'
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

      previewImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
      },
      imageWrapper: {
        position: 'relative',
        margin: 5,
      },
      removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 50,
        padding: 5,
      }


})