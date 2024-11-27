import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable, Alert, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { db } from '../firebaseconfig';
import firebase from 'firebase/compat/app';
import useUserManager from '../hooks/useUserManager';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';


const CreateGroup2 = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { currentUser } = useUserManager();
  const members = route?.params?.members;

  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    setSelectedMembers(members);
  }, [members]);

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const imageUrl = await uploadImageToFirebase(selectedImage.uri);
        setGroupImage(imageUrl);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick an image. Please try again.");
    }
  };

  const uploadImageToFirebase = async (imageUri) => {
    try {
      const storage = getStorage();
      const response = await fetch(imageUri); 
      const blob = await response.blob(); 
  
      const storageRef = ref(storage, `groupImages/${Date.now()}.jpg`); 
      await uploadBytes(storageRef, blob); 
  
      const downloadURL = await getDownloadURL(storageRef); 
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleRemoveMember = (memberId) => {
    const filteredMembers = selectedMembers?.filter((member) => member?.id !== memberId);
    setSelectedMembers(filteredMembers);
  };

  const createGroup = async () => {
    if (groupName && selectedMembers?.length > 0 && currentUser?.id) {
      setLoading(true);
      try {
        const groupData = {
          name: groupName,
          adminId: currentUser?.id,
          members: [...selectedMembers, currentUser],
          image: groupImage,
          createdAt: serverTimestamp(),
        };

        const groupRef = await addDoc(collection(db, "groups"), groupData);
        if (groupRef?.id) {
          navigation.replace('InvestorGroups');
        }
      } catch (error) {
        console.error("Error creating group:", error);
      } finally {
        setLoading(false)
      }
    } else {
      Alert.alert(
        'Warning',
        'Please filled the all required fields'
      )
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps='always' style={styles.mainContainer}>
      <BackButton />
      <View style={{ alignItems: 'center' }}>
        <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 100, }}>
          Add Group Description
        </FText>
      </View>

      <View style={styles.inputContainer}>


        <TouchableOpacity style={styles.iconContainer} onPress={handleImagePicker}>
          <Image source={groupImage
            ? { uri: groupImage }
            : require('../assets/images/Profile/camera.png')}
            style={groupImage && {
              width: 50,  // Set width
              height: 50,  // Set height
              borderRadius: 25,  // Make the image circular
              resizeMode: 'cover'  // Ensure the image covers the entire area
            }
            } />
        </TouchableOpacity>


        <TextInput
          style={styles.input}
          placeholder="Group Name"
          placeholderTextColor={"#A1A5C1"}
          onChangeText={(text) => setGroupName(text)}
          value={groupName}
        />
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, marginLeft: 40 }}>
        <View style={styles.optionIcon}>
          <FontAwesome6 name="user-group" size={25} color={colours.primary} />
        </View>
        <FText fontSize='large' fontWeight={700} color={colours.primary} > Members </FText>

      </View>

      <View style={[styles.imageContainer, selectedMembers.length > 0 && styles.imagesConatiner]}>
        {selectedMembers?.map((member, index) => {
          return (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: member?.profilePic }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member?.id)}
              >
                <Ionicons name="close-circle" size={18} color="red" />
              </TouchableOpacity>
            </View>
          )
        })}
      </View>

      <TouchableOpacity onPress={createGroup} style={styles.button} disabled={loading} >
        {loading ? <ActivityIndicator size={'small'} color={colours.primary} />
          : <FText fontSize="small" fontWeight={700} color={colours.white}>
            Create
          </FText>}
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
    fontFamily: fonts.LatoRegular,

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

  imageContainer: {
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
  imagesConatiner: {
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
    fontFamily: fonts.LatoRegular,

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