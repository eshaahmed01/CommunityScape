import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import FText from "../components/Ftext";
  import { colours } from "../constants/colours";
  import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import BackButton from "../components/BackButtons";
import fonts from "../constants/fonts";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from 'react-native-vector-icons';

const ArchitectProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState(0);
    const [availability, setAvailibility] = useState('');
    const [hourlyRate, sethourlyRate] = useState('');
    const [ workImages, setWorkImages] = useState([]);

    console.log(name);
    console.log(email);
    console.log(description);

//upload image from gallery
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

console.log(profilePic);

const handleMultipleImages = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    // Combine the newly selected images with the existing images
    const newImages = result.assets.map(image => image.uri);
    setWorkImages(prevImages => [...prevImages, ...newImages]);
  }
};

console.log(workImages);

const handleRemoveImage = (uri) => {
  setWorkImages(prevImages => prevImages.filter(imageUri => imageUri !== uri));
};

    return (
        
        <ScrollView style={styles.mainContainer}>
           <View > 
            <BackButton> </BackButton>
            <View > 
             <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{marginTop: 120, marginLeft: 30}} >
              My Profile
            </FText>
            <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 30}}> Please complete your profile </FText>
            </View>
            
            <TouchableOpacity onPress={handleImagePicker} style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}}> 
                <Image source={profilePic
              ? { uri: profilePic } 
              : require('../assets/images/Profile/upload.png')} 
               style={ profilePic && {
                width: 100,  // Set width
                height: 100,  // Set height
                borderRadius: 50,  // Make the image circular
                resizeMode: 'cover'  // Ensure the image covers the entire area
              }}/>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
           <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                Name
            </FText>
            <TextInput
               style={styles.input}
               placeholder="Enter your Name"
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setName}
               value={name}
               />
             </View>

             <View style={styles.inputContainer}>
               <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                Email address
                </FText>
             <TextInput
               style={styles.input}
              placeholder=" Enter your Email address"
              placeholderTextColor={"#A1A5C1"}
              onChangeText={setEmail}
              value={email}
               
               />
              </View>

              <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Description
        </FText>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your Description"
          multiline
          numberOfLines={4}
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setDescription}
          value={description}
        />
      </View>

      <View style={styles.inputContainer}> 
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}> Upload Images of Previous work </FText>
        <TouchableOpacity onPress={handleMultipleImages} style={[styles.imageContainer, workImages.length > 0 && styles.imagesConatiner]}> 
          {workImages && workImages.length > 0 ?  (workImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(uri)}
            >
              <Ionicons name="close-circle" size={18} color="red" />
            </TouchableOpacity>
          </View>
          )))
          :
         ( <FText fontSize="large" fontWeight={700} color={colours.success} > Choose Images <FText fontSize="large" fontWeight={700} color={colours.typography_60}> or drop here </FText></FText>)
          }
            
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMultipleImages}> 
        <FText fontSize="normal" fontWeight={700} color={colours.success} style={{marginTop: -10}}> Add more </FText>
        </TouchableOpacity>
      </View>
  
      <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Years of Experience
        </FText>
        <TextInput
          style={styles.input}
          placeholder="Add your work experience here"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setExperience}
          value={experience}
        />
      </View>

      <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Share your availability 
        </FText>
        <TextInput
          style={styles.input}
          placeholder="for eg: 9AM TO 5PM EST"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={setAvailibility}
          value={availability}
        />
      </View>

      <View style={styles.inputContainer}>
        <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
          Enter your hourly Rate
        </FText>
        <TextInput
          style={styles.input}
          placeholder="for eg: $30-40"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={sethourlyRate}
          value={hourlyRate}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <FText fontSize="large" fontWeight={700} color={colours.white}> 
            Submit
        </FText>
         </TouchableOpacity>
             </View>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colours.secondary
    },
    inputContainer: {
        marginTop: 21,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10
      },

      imageContainer : {
        height: 150,
        backgroundColor: '#F4F5F8',
        width: '100%',
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
        width: '100%',
        marginLeft: 5,
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
         width: '80%',
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

export default ArchitectProfile;