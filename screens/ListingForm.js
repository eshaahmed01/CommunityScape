import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import Icon from 'react-native-vector-icons/FontAwesome6'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from '../constants/fonts'
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from 'react-native-vector-icons';
import Icons from 'react-native-vector-icons/AntDesign';

import React, { useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs, limit, query } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import useImageHandler from '../hooks/useImageHandler'

const ListingForm = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const { uploadImageToFirebase } = useImageHandler();

  const [open, setOpen] = useState(false);
  const [propertyType, setPropertyType] = useState(null);
  const [propImages, setPropImages] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEstateData, setSelectedEstateData] = useState(null);

  const docId = route?.params?.docId ?? null;

  useEffect(() => { getSingleEstate(); }, [docId]);

  const getSingleEstate = async () => {
    setLoading(true);
    try {
      const estateDocRef = doc(db, 'Estates', docId);
      const estateDoc = await getDoc(estateDocRef);

      if (estateDoc.exists()) {
        let response = { id: estateDoc.id, ...estateDoc.data(), estateDetails: null };

        const estateDetailsRef = collection(estateDocRef, 'EstateDetails');
        const estateDetailsQuery = query(estateDetailsRef, limit(1));
        const estateDetailsSnapshot = await getDocs(estateDetailsQuery);

        if (!estateDetailsSnapshot.empty) {
          const detailDoc = estateDetailsSnapshot.docs[0];
          response.estateDetails = { id: detailDoc.id, ...detailDoc.data() };
        } else {
          console.log('No EstateDetails found');
        };

        setSelectedEstateData(response);
        setPropImages(response.estateDetails.Images);
        setAddress(response?.Location);
        setPropertyType(response?.Type);
        setLoading(false);

      } else {

        setLoading(false);
        return null;
      }
    } catch (error) {
      console.log('error', error)
      setLoading(false);
      throw error;
    }
  };

  const handleNavigateToNext = () => {
    navigation.navigate('ListingForm2', {
      propertyType: propertyType,
      propImages: propImages,
      address: address,
      docId : docId,
      ...selectedEstateData
    });
  };

  const handleMultipleImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Combine the newly selected images with the existing images
      const newImages = await Promise.all(
        result.assets.map(async (image) => {
          const imageUrl = await uploadImageToFirebase('estates/', image?.uri);
          return imageUrl;
        })
      );
      setPropImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (uri) => {
    setPropImages(prevImages => prevImages.filter(imageUri => imageUri !== uri));
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.headerView}>
          <BackButton> </BackButton>

        </View>

        <View style={{ flexDirection: 'row' }}>
          <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{ marginTop: 20, marginLeft: 15 }}> Create your own listing </FText>
        </View>

        {
          loading ? <ActivityIndicator color={colours.primary} />
            : <>
              <View>
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
                    items={[
                      { label: "House", value: "House" },
                      { label: "Apartment", value: "Apartment" },

                    ]}
                    open={open}
                    value={propertyType}
                    setOpen={setOpen}
                    setValue={setPropertyType}
                    onChangeValue={setPropertyType}
                    placeholder="Select Property Type"
                    placeholderTextColor={"#A1A5C1"}
                    style={styles.dropdown}
                    textStyle={styles.text}
                    dropDownContainerStyle={styles.dropdownList}
                    listItemLabelStyle={styles.listItemLabelStyle}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}> Upload Images of your Property </FText>
                <TouchableOpacity onPress={handleMultipleImages} style={[styles.imageContainer, propImages.length > 0 && styles.imagesConatiner]}>
                  {propImages && propImages.length > 0 ? (propImages.map((uri, index) => (
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
                    (

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icons name="pluscircle" size={30} color='#8BC83F' />
                        <FText fontSize="large" fontWeight={700} color={colours.success} > Choose Images <FText fontSize="large" fontWeight={700} color={colours.typography_60}> or drop here </FText></FText>
                      </View>
                    )
                  }

                </TouchableOpacity>
                <TouchableOpacity onPress={handleMultipleImages}>
                  <FText fontSize="normal" fontWeight={700} color={colours.success} style={{ marginTop: -10 }}> Add more </FText>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
                  Address:
                </FText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter complete address"
                  placeholderTextColor={"#A1A5C1"}
                  onChangeText={setAddress}
                  value={address}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleNavigateToNext}>
                <FText fontSize="large" fontWeight={700} color={colours.white}>
                  Next
                </FText>
              </TouchableOpacity>
            </>
        }


      </View>
    </ScrollView>
  )
}

export default ListingForm;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.secondary
  },
  headerView: {
    flexDirection: "row",
    marginTop: 21,
    height: 104,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },

  dropdownContainer2: {
    marginTop: 50,
    paddingHorizontal: 30,


  },
  dropdown: {
    backgroundColor: "#F5F4F8",
    borderColor: colours.primary,
    fontFamily: fonts.LatoRegular,
    borderColor: '#F4F5F8',
    borderWidth: 1,
    zIndex: 1000

  },
  dropdownList: {
    borderColor: "#A1A5C1",

  },
  text: {
    fontFamily: fonts.LatoRegular,
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
    marginLeft: 20,
    marginRight: 30,
    marginBottom: 10
  },

  imageContainer: {
    flexDirection: 'row',
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