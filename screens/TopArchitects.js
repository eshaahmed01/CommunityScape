import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, Pressable,  Animated} from 'react-native';
import BackButton from '../components/BackButtons';
import FText, { FontWeights } from '../components/Ftext';
import { colours } from '../constants/colours';
import { ScrollView } from 'react-native';
import Michael from '../assets/images/Michael.jpeg';
import Samantha from '../assets/images/Samantha.jpeg';
import Jaden from '../assets/images/Jaden.jpeg';
import Lara from '../assets/images/Lara.jpeg';
import Breanna from '../assets/images/Breanna.jpeg';
import Anderson from '../assets/images/Anderson.jpeg';
import ArchitectTile from '../components/ArchitectTile';
import { useState, useEffect, useRef} from 'react';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import { TouchableOpacity } from 'react-native-gesture-handler';

const filter = '../assets/images/Profile/filter.png'


const TopArchitects = ({ navigation }) => {

    const [architects, setArchitects] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [originalArchitects, setOriginalArchitects] = useState([]);
    


    const slideAnim = useRef(new Animated.Value(1000)).current; // Initial position off-screen
//// fetching Architects Data
 useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const q = query(collection(db, "Architects"))
        const querySnapshot = await getDocs(q);
        const docsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched Documents:", docsArray);
        setArchitects(docsArray);
        setOriginalArchitects(docsArray);
      } catch (e) {
        console.error("Error getting documents: ", e);
      }
    };
  
    fetchDocuments();
  }, []);


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
  };

//filters for architects
  const applyFilter = (criteria) => {
    // Convert price range to a numeric value (taking the highest value in the range for comparison)
    const parsePrice = (priceStr) => {
      const match = priceStr.match(/\$([0-9]+)-([0-9]+)/);
      if (match) {
        return parseInt(match[2], 10); // Return the high end of the range
      }
      return 0;
    };
  
    // Convert rating to a numeric value
    const parseRating = (ratingStr) => {
      return parseFloat(ratingStr);
    };
  
    let filteredData;
    if (criteria === 'highPrice') {
      // Sort by high price (descending order)
      filteredData = [...architects].sort((a, b) => parsePrice(b.Rate) - parsePrice(a.Rate));
    } else if (criteria === 'lowPrice') {
      // Sort by low price (ascending order)
      filteredData = [...architects].sort((a, b) => parsePrice(a.Rate) - parsePrice(b.Rate));
    } else if (criteria === 'highRating') {
      // Sort by high rating (descending order)
      filteredData = [...architects].sort((a, b) => parseRating(b.Rating) - parseRating(a.Rating));
    }
    setArchitects(filteredData);
    setActiveFilter(criteria);
    closeModal();
  };



    return (
        <ScrollView style={{ flex: 1 }}>
            <BackButton />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}> 
            <FText color={colours.typography_60} fontSize='h3' fontWeight={900} style={styles.heading}> Top Architects </FText>
            <TouchableOpacity style = {styles.filterButton } onPress={openModal}> 
            <Image source={require(filter)}/>
            </TouchableOpacity>
            </View>
            <FText color={colours.typography_60} fontSize='small' fontWeight={400} style={{ marginLeft: 30 }}> Find the best architects through our platform </FText>
            <View style={{ marginHorizontal: '4%', marginTop: 20 }}>
                <FlatList
                    data={architects}
                    keyExtractor={(item) => item.Number.toString()}
                    renderItem={({ item }) => <ArchitectTile architect={item}
                        onPress={() => navigation.navigate('ProfileDetails', { id: item.id, name: item.Name, image: item.ProfileImage, rating: item.Rating, homeSold: item.ProjectsDone, num: item.Number })}
                    />}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >

     <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>
            <FText fontSize='h6' fontWeight={700} color={colours.typography_60} style={{marginBottom: 20}}>Filter With</FText>
            <Pressable style={styles.button} onPress={() => applyFilter('highPrice')}>
              <FText fontSize='normal' fontWeight={700} color={colours.typography_60}>High Price  {activeFilter === 'highPrice' && '✔️'}</FText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => applyFilter('lowPrice')}>
              <FText fontSize='normal' fontWeight={700} color={colours.typography_60} >Low Price  {activeFilter === 'lowPrice' && '✔️'}</FText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => applyFilter('highRating')} >
              <FText fontSize='normal' fontWeight={700} color={colours.typography_60}>High Rating  {activeFilter === 'highRating' && '✔️'}</FText>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonClose]} 
             onPress={() => {
              setActiveFilter(null); // Reset active filter
              setArchitects(originalArchitects); // Reset filtered data
              closeModal();
            }}
            >
              <FText fontSize='normal' fontWeight={700} color={colours.secondary} >Clear</FText>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
        </ScrollView>
    )
}

export default TopArchitects;

const styles = StyleSheet.create({
    heading: {
        marginTop: 120,
        marginLeft: 20
    },
    tilesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        marginLeft: 20,
        width: "50%",
        marginRight: 30

    },
    filterButton: {
      marginTop: 120,
      marginRight: 21,
      zIndex: 999,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 8, // Required for Android
      backgroundColor: 'white',
      borderRadius: 25
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      
    },
    modalView: {
      marginTop: 'auto',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
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
    button: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f2f2f2',
      borderRadius: 5,      
    },
    buttonClose: {
      alignSelf: 'center',
      width: '50%',
      alignItems: 'center',
      backgroundColor: '#8BC83F'
    },
    textStyle: {
      color: 'black',
      fontWeight: 'bold',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
