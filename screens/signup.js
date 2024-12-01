import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, StatusBar, StyleSheet, TextInput, Dimensions, ScrollView, Button, Modal, Animated } from 'react-native';
import { Card } from 'react-native-shadow-cards';
import { useNavigation } from '@react-navigation/native';
import { app, db } from '../firebaseconfig'; // Adjust the path as necessary
import * as FileSystem from 'expo-file-system';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
// import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import LoginIcon from '../assets/img/login.png';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';


export default function SignUp() {
  const ImgPath = "../assets/images/Profile/";
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [imageAdded, setImageAdded] = useState(false); // State to control the green popup
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(1000)).current; // Initial position off-screen
  const [firebaseError, setFirebaseError] = useState(false);

  const handleImagePicker = async () => {
    console.log("Image picker opened"); // Debug: Check if the picker is opened

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result); // Debug: Check the result of the image picker

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log("Image selected:", uri); // Debug: Check if an image is selected
      setProfilePic(uri);
      setImageAdded(true); // Show popup for successful image addition
      // setTimeout(() => setImageAdded(false), 3000); // Hide popup after 3 seconds

      try {
        // Convert image to base64s
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Image converted to base64"); // Debug: Check if base64 conversion is successful

        // Update the profile picture URL in the state
        const base64Image = `data:image/jpeg;base64,${base64Data}`;
        setProfilePic(base64Image);

      } catch (error) {
        console.error("Error converting image to base64:", error); // Debug: Catch and log any errors during conversion
      }
    } else {
      console.log("Image picker canceled or no image selected"); // Debug: If the image picker was canceled or no image was selected
    }
  };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

  navigation.navigate('Login')
};
  const handleSignUp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
  
    if (!emailRegex.test(email)) {
      setError('Invalid email');
      return;
    }
  
    if (!password) {
      setError('Password is required');
      return;
    }
  
    if (!passwordRegex.test(password)) {
      setError('Invalid Password');
      return;
    }
    // if (!imageAdded) {
    //   return;
    // }
    

    setError(null);
 


    try {
      // Sign up the user with Firebase Auth
      const auth = getAuth(app); // Ensure you are using the initialized app
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      // Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        profilePic: profilePic || '', // Add profilePic base64 string if available
      });

      // Verify that data was added to Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('User data added to Firestore:', docSnap.data());
      } else {
        console.log('No such document!');
      }

      setEmail('');
      setPassword('');
      
    } catch (error) {
      console.error('Error signing up:', error);
      setFirebaseError(error.message)
      console.log(firebaseError);
      return;
      
    }
    
    openModal();

  };

  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent backgroundColor="gray" />
      <View style={styles.container}>
        <Image source={LoginIcon} style={styles.icon} />
        <View  style={{marginLeft: 20}}> 
        <FText fontSize='h5' fontWeight={400} color={colours.primary} >Create your <FText fontSize='h5' fontWeight={900} color={colours.primary}>account </FText></FText>
        </View>

        <TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center', marginTop: 20}} onPress={handleImagePicker} > 
        <Image source={profilePic
              ? { uri: profilePic } 
              :  require('../assets/images/Profile/upload.png') } 
               style={ profilePic && {
                width: 70,  // Set width
                height: 70,  // Set height
                borderRadius: 35,  // Make the image circular
                resizeMode: 'cover'  // Ensure the image covers the entire area
              } 
              }/>
                </TouchableOpacity>



        

            { !imageAdded  && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Please upload image
        </FText>
      )}


            <View style={styles.inputContainer}>
            <Image source={require('../assets/svg/Profile.png')} style={styles.iconStyle} /> 
            <TextInput
               style={styles.input}
               placeholder="Full Name"
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setFullName}
               value={fullName}
               />
             </View>

             <View style={styles.inputContainer}>
              <Image source={require('../assets/svg/Email.png')} style={styles.iconStyle} /> 
            <TextInput
               style={styles.input}
               placeholder="Email"
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setEmail}
               value={email}
               />
             </View>
             { error === 'Email is required' && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Email is required
        </FText>
      )}

      { error === 'Invalid email' && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Email is invalid
        </FText>
      )}

{ firebaseError === 'Firebase: Error (auth/email-already-in-use).' && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Email already exists
        </FText>
      )}

             <View style={styles.inputContainer}>
             <Image source={require('../assets/svg/Lock.png')} style={styles.iconStyle} /> 
            <TextInput
               style={styles.input}
               placeholder="Password"
               placeholderTextColor={"#A1A5C1"}
               onChangeText={setPassword}
               value={password}
               />
             </View>

             { error === 'Password is required' && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Password is required
        </FText>
      )}

       { error === 'Invalid Password' && (
        <FText fontSize="medium" fontWeight={700} color="red" style={{ marginTop: 5, marginLeft: 30 }}>
          Password must contain one uppercase letter, one number and one special character
         
        </FText>
      )}
             <TouchableOpacity style={styles.button} onPress={handleSignUp} >
        <FText fontSize='small' fontWeight={700} color={colours.white}> 
            Register
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
           
            <FText fontSize='h6' fontWeight={700} color={colours.primary}> Account successfully </FText>
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
         
        <TouchableOpacity style={{ marginTop: 5, alignItems: 'center' }} onPress={() => navigation.navigate("Login")}>
          <FText fontSize='small' fontWeight={700} color={colours.primary}>Already have an account?</FText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    
    marginTop: 70,
    flex: 1,
    backgroundColor: "white",
    
  },
  icon: {
    marginBottom: 20,
  },
  profilePicContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F5F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center'
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  uploadText: {
    color: '#888',
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',    // Align icon and TextInput in a row
    alignItems: 'center',    // Center items vertically
    backgroundColor: '#F5F4F8', // Light background color
    paddingHorizontal: 10,   // Padding inside the container
    height: 50, 
    marginTop: 21,
      marginLeft: 30,
      marginRight: 30,
      
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
  inputcard: {
    width: width - 40,
    padding: 1,
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F8',
  },
  cardStyle: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8BC83F',
    width: 200,
    height: 63,
  },
  modalText: {
    fontSize: 16,
    color: 'white',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  fbBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 40,
    elevation: 2,
    backgroundColor: '#3b5998',
  },
  fbTextStyle: {
    marginLeft: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  googleBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
    backgroundColor: 'white',
  },
  googleTextStyle: {
    marginLeft: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },

  iconStyle : {
    width: 25,               // Adjust icon width
    height: 25,              // Adjust icon height
    tintColor: colours.primary,    // Optional: colorize the icon if needed
    marginRight: 10, 
    
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
  },
  
});