import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import { colours } from '../constants/colours';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { app , db, auth} from '../firebaseconfig'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import fonts from '../constants/fonts';
const EditProfile = () => {

   const route = useRoute();
   const { userData } = route.params;
   const [newProfilePic, setNewProfilePic] = useState(null);
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('')
   const [passwordError, setPasswordError] = useState(false);



   const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewProfilePic(result.assets[0].uri);
    }
  };

  

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

    return (
        <View style={styles.mainContainer}>
      
      <BackButton></BackButton>
      <View style={styles.container}> 
      <View style={{position: 'relative'}}> 
      <FText fontSize='h6' fontWeight={900} color={colours.primary} style={{marginTop: 120, marginLeft: 20}}> Edit Your Profile </FText>
      {newProfilePic ? (
          <Image source={{ uri: newProfilePic }} style={styles.profilePic} />
        ) : userData?.profilePic ? (
          <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePic} />
        )}
     <TouchableOpacity style={styles.icon} onPress={handleImagePicker} >
       <Icon name="camera" size={30} color={colours.aslo_gray}/>
        </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
           <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
               Edit Name
            </FText>
            <TextInput
               style={styles.input}
               placeholder={userData.fullName}
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setName}
               value={name}
               />
             </View>

             <View style={styles.inputContainer}>
           <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
               Change Password
            </FText>
            <TextInput
               style={styles.input}
               secureTextEntry={true}
               onChangeText={setPassword}
               value={password}
               />
             </View>

             <View style={styles.inputContainer}>
           <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
               Confirm New Password
            </FText>
            <TextInput
               style={styles.input}
               onChangeText={handleConfirmPasswordChange}
               secureTextEntry={true}
               value={confirmPassword}
               />
             </View>

             { passwordError && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Passwords do not match
        </FText>
      )}

             <TouchableOpacity style={styles.button}  >
        <FText fontSize="large" fontWeight={700} color={colours.white}> 
            Save Changes
        </FText>
         </TouchableOpacity>

      </View>

</View>
      )}
    
export default EditProfile;

const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: colours.secondary,
      flex: 1,
     
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        marginBottom: 20,
        marginTop : 20,
        alignSelf: 'center'
      },

    icon: {
        position: 'absolute',
        bottom: 10,
        right: 150

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
    }
});



