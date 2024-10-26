import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from '../constants/fonts'
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../firebaseconfig'

const ListingForm3 = () => {
  const route = useRoute();
  const { propertyType, propImages, address, diningRoom, livingRoom, bathrooms, bedrooms } = route.params;
  const docId = route?.params?.docId ?? null;

  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [gasStations, setGasStations] = useState(0);
  const [parks, setParks] = useState(0);
  const [schools, setSchools] = useState(0);
  const [gym, setGym] = useState(0);
  const [price, setPrice] = useState(0);
  const [rent, setRent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({ userName: "", userImage: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const data = route?.params;
    const estateDetails = data?.estateDetails;
    const amenities = estateDetails?.Amenities;

    amenities?.forEach((item) => {
      const [number, ...typeArray] = item.split(" ");
      const numberAsString = number?.toString();
      const type = typeArray?.join(" ")?.toLowerCase();

      switch (type) {
        case "schools":
          setSchools(numberAsString);
          break;
        case "gymnasiums":
          setGym(numberAsString);
          break;
        case "children parks":
          setParks(numberAsString);
          break;
        case "gas stations":
          setGasStations(numberAsString);
          break;
        // case "sports complex":
        //   setSportsComplex(numberAsString);
        //   break;
        default:
          break;
      };

      setRent(estateDetails?.Rent);
      setPrice(data?.Price);

    });
  }, [docId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));

          if (!userDoc.empty) {
            const data = userDoc.docs[0].data();
            setUserData({ userName: data.fullName, userImage: data.profilePic });
          } else {
            console.log('No user document found!');
          }
        } else {
          console.log('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Hide the loading indicator once data is fetched
      }
    };

    fetchUserData(); // Call the function
  }, []);

  const addOrUpdateEstate = async (estateData, estateDetails) => {
    try {
      const estatesRef = collection(db, 'Estates');
      let estateRef;

      if (docId) {
        // Update existing estate
        estateRef = doc(estatesRef, docId);
        await updateDoc(estateRef, {
          ImageURL: estateData.ImageURL,
          ListingType: estateData.ListingType,
          Location: estateData.Location,
          Name: estateData.Name,
          Price: estateData.Price,
          Rating: estateData.Rating,
          State: estateData.State,
          Type: estateData.Type,
          isSold: estateData.isSold
        });
      } else {
        // Create new estate
        estateRef = doc(estatesRef);
        await setDoc(estateRef, {
          ImageURL: estateData.ImageURL,
          ListingType: estateData.ListingType,
          Location: estateData.Location,
          Name: estateData.Name,
          Price: estateData.Price,
          Rating: estateData.Rating,
          State: estateData.State,
          Type: estateData.Type,
          isSold: estateData.isSold
        });
      }

      const estateDetailsRef = collection(estateRef, 'EstateDetails');
      const estateDetailsQuery = query(estateDetailsRef);
      const estateDetailsSnapshot = await getDocs(estateDetailsQuery);

      if (!estateDetailsSnapshot.empty) {
        const estateDetailsDoc = estateDetailsSnapshot.docs[0];
        await updateDoc(estateDetailsDoc.ref, {
          Amenities: estateDetails.Amenities,
          Description: estateDetails.Description,
          Images: estateDetails?.Images,
          ListerImage: estateDetails?.ListerImage,
          ListerName: estateDetails?.ListerName,
          ListerPhone: estateDetails?.ListerPhone,
          Rent: estateDetails?.Rent
        });
      } else {
        await addDoc(estateDetailsRef, {
          Amenities: estateDetails.Amenities,
          Description: estateDetails.Description,
          Images: estateDetails?.Images,
          ListerImage: estateDetails?.ListerImage,
          ListerName: estateDetails?.ListerName,
          ListerPhone: estateDetails?.ListerPhone,
          Rent: estateDetails?.Rent
        });
      }

      return estateRef.id;

    } catch (error) {
      console.error('Failed to manage estate:', error);
      throw error;
    }
  } 

  const addEstate = async () => {

    const estateData = {
      ImageURL: propImages[0],
      ListingType: "SellerListing",
      Location: address,
      Name: propertyType === "House" ? "House" : "Apartment",
      Price: price,
      Rating: 4.8,
      State: "Chicago IL",
      Type: propertyType,
      isSold: false,
      createdAt: serverTimestamp()
    };

    const estateDetails = {
      Amenities: [
        `${1} Hospitals`,
        `${gym} Gymnasiums`,
        `${parks} Children Parks`,
        `${schools} Schools`,
        `${gasStations} Gas Stations`,
        `${1} Sports Complex`
      ],
      Description: [
        `${bedrooms} Bedroom`,
        `${bathrooms} Bathroom`,
        `${livingRoom} Living room`,
        `${diningRoom} Dining Room`
      ],
      Images: [...propImages],
      ListerImage: userData.userImage,
      ListerName: userData.userName,
      ListerPhone: "418 319 6565",
      Rent: rent
    };

    try {
      const newEstateId = await addOrUpdateEstate(estateData, estateDetails);
      return newEstateId;
    } catch (error) {
      console.error('Failed to add new estate:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const isStateAdded = await addEstate();
    setLoading(false);
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
       if (isStateAdded) {
        navigation.navigate('Ads', { docId: isStateAdded });
      };
    }, 1000);
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

        <View >
          <FText
            fontSize="large"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 20, marginLeft: 28 }}
          >
            Gas Stations:
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "None", value: "0" },

              ]}
              open={open}
              value={gasStations}
              setOpen={setOpen}
              setValue={setGasStations}
              onChangeValue={setGasStations}
              placeholder="Select number of close gas stations"
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
            Parks:
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "None", value: "0" },

              ]}
              open={open2}
              value={parks}
              setOpen={setOpen2}
              setValue={setParks}
              onChangeValue={setParks}
              placeholder="Select number of close parks"
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
            Schools/University:
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "None", value: "0" },

              ]}
              open={open3}
              value={schools}
              setOpen={setOpen3}
              setValue={setSchools}
              onChangeValue={setSchools}
              placeholder="Select an option"
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
            Gym:
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "None", value: "0" },

              ]}
              open={open4}
              value={gym}
              setOpen={setOpen4}
              setValue={setGym}
              onChangeValue={setGym}
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
            Price
          </FText>
          <TextInput
            style={styles.input}
            placeholder="Enter in $"
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setPrice}
            value={price}
          />
        </View>

        <View style={styles.inputContainer}>
          <FText fontSize="large" fontWeight={700} color={colours.primary} style={styles.label}>
            Rent/Month:
          </FText>
          <TextInput
            style={styles.input}
            placeholder="Enter in $"
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setRent}
            value={rent}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <FText fontSize="large" fontWeight="400" color={colours.typography_60}>
                { docId ? 'Listing Updated!' : 'Listing Posted!'}
              </FText>
            </View>
          </View>
        </Modal>

        <TouchableOpacity disabled={loading} style={styles.button} onPress={handleSubmit} >
          {loading ? <ActivityIndicator color={"white"} />
            : <FText fontSize="large" fontWeight={700} color={colours.white}>
              Submit
            </FText>}
        </TouchableOpacity>


      </View>
    </ScrollView>
  )
}

export default ListingForm3;

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
    marginLeft: 30,
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  }

})