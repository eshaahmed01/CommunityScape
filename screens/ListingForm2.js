import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import Icon from 'react-native-vector-icons/FontAwesome6'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from '../constants/fonts'
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

const ListingForm2 = () => {

  const route = useRoute();
  const { propertyType, propImages, address } = route.params;
  const docId = route?.params?.docId ?? null;

  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [diningRoom, setDiningRoom] = useState(0);
  const [livingRoom, setLivingRoom] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);

  useEffect(() => {

    const description = route?.params?.estateDetails?.Description;

    description?.forEach((item) => {
      const [number, type] = item.split(" ");
      const numberAsString = number?.toString();
      switch (type.toLowerCase()) {
        case "bedroom":
          setBedrooms(numberAsString);
          break;
        case "bathroom":
          setBathrooms(numberAsString);
          break;
        case "living":
          setLivingRoom(numberAsString);
          break;
        case "dining":
          setDiningRoom(numberAsString);
          break;
        default:
          break;
      }
    });
  }, [docId]);

  const handleNavigateToNext = () => {
    navigation.navigate('ListingForm3', {
      propertyType: propertyType,
      propImages: propImages,
      address: address,
      diningRoom: diningRoom,
      livingRoom: livingRoom,
      bathrooms: bathrooms,
      bedrooms: bedrooms,
      ...route?.params
    });
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.headerView}>
          <BackButton> </BackButton>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <FText fontSize='h5' fontWeight='700' color={colours.primary} style={{ marginTop: 20, marginLeft: 15 }}> Select Details </FText>
        </View>

        {
          <>
            <View>
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
                  items={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },

                  ]}
                  open={open}
                  value={bedrooms}
                  setOpen={setOpen}
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

            <View>
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
                  items={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },

                  ]}
                  open={open2}
                  value={bathrooms}
                  setOpen={setOpen2}
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

            <View>
              <FText
                fontSize="large"
                fontWeight={700}
                color={colours.primary}
                style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
              >
                Living Room:
              </FText>

              <View style={styles.dropdownContainer2}>
                <DropDownPicker
                  items={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },

                  ]}
                  open={open3}
                  value={livingRoom}
                  setOpen={setOpen3}
                  setValue={setLivingRoom}
                  onChangeValue={setLivingRoom}
                  placeholder="Select an option"
                  placeholderTextColor={"#A1A5C1"}
                  style={styles.dropdown}
                  textStyle={styles.text}
                  dropDownContainerStyle={styles.dropdownList}
                  listItemLabelStyle={styles.listItemLabelStyle}
                />
              </View>
            </View>

            <View>
              <FText
                fontSize="large"
                fontWeight={700}
                color={colours.primary}
                style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
              >
                Dining Room:
              </FText>

              <View style={styles.dropdownContainer2}>
                <DropDownPicker
                  items={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },

                  ]}
                  open={open4}
                  value={diningRoom}
                  setOpen={setOpen4}
                  setValue={setDiningRoom}
                  onChangeValue={setDiningRoom}
                  placeholder="Select an option"
                  placeholderTextColor={"#A1A5C1"}
                  style={styles.dropdown}
                  textStyle={styles.text}
                  dropDownContainerStyle={styles.dropdownList}
                  listItemLabelStyle={styles.listItemLabelStyle}
                />
              </View>
            </View>

          </>
        }


        <TouchableOpacity style={styles.button} onPress={handleNavigateToNext}>
          <FText fontSize="large" fontWeight={700} color={colours.white}>
            Next
          </FText>
        </TouchableOpacity>


      </View>
    </ScrollView>
  )
}

export default ListingForm2;

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