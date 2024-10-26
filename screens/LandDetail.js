import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Button,
    Animated,
    Pressable,
    Modal
  } from "react-native";
  import React, { useState, useEffect, useRef, lazy } from "react";
  import FText from "../components/Ftext";
  import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import Carousel from "../components/Carousel";
import Icon from 'react-native-vector-icons/FontAwesome6'


const filter = '../assets/images/Profile/filter.png'
const ImgPath = "../assets/images/Home/";
const LandData = [{
  Images : [
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m3461764470rd-w960_h720.webp',
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m2255419872rd-w1280_h960.webp',
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m3030162043rd-w1280_h960.webp',
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m3462436918rd-w1280_h960.webp',
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m180248004rd-w1280_h960.webp',
    'https://ap.rdcpix.com/1d6e9ad62d3c49f844a1657e8c503963l-m1395271048rd-w1280_h960.webp'
  ],
  Price : 187000,
  Location : '1343 Lincoln St NE, Minneapolis, MN 55413',
  Size: '7841 sqft',
  Phone : '317 445 6768'
},
{
Images : [
  'https://ap.rdcpix.com/c1839775d277901c356e951171de10eel-b3273016512rd-w1280_h960.webp',
  'https://ap.rdcpix.com/c1839775d277901c356e951171de10eel-b1183724681rd-w1280_h960.webp',
  'https://ap.rdcpix.com/c1839775d277901c356e951171de10eel-b3579310384rd-w1280_h960.webp',
  'https://ap.rdcpix.com/c1839775d277901c356e951171de10eel-b329058588rd-w1280_h960.webp',
  'https://ap.rdcpix.com/c1839775d277901c356e951171de10eel-b898588541rd-w1280_h960.webp'
],
Price: 199000,
Location: '5121/5115 Lake Ridge Rd, Edina, MN 55436',
Size: '1.45 Acre',
Phone: '111 621 7878'
},
{
  Images: [
    'https://ap.rdcpix.com/395f65f1727e833857f16b46fa6ffb84l-m2552746750rd-w960_h720.webp',
    'https://ap.rdcpix.com/395f65f1727e833857f16b46fa6ffb84l-m2603462441rd-w1280_h960.webp',
    'https://ap.rdcpix.com/395f65f1727e833857f16b46fa6ffb84l-m1136643896rd-w1280_h960.webp',
    'https://ap.rdcpix.com/395f65f1727e833857f16b46fa6ffb84l-m2408013002rd-w1280_h960.webp',
    'https://ap.rdcpix.com/395f65f1727e833857f16b46fa6ffb84l-m1017405844rd-w1280_h960.webp'
  ],
  Price: 375000,
  Location: '161 SE 267th Pl, Covington, WA 98042',
  Size: '0.32 Acre',
  Phone: '667 240 3939'
},
{
  Images: [
    'https://ap.rdcpix.com/4da695b2738254f8c0efb641e73912b1l-m1053227083rd-w960_h720.webp',
    'https://ap.rdcpix.com/4da695b2738254f8c0efb641e73912b1l-m3392607107rd-w1280_h960.webp',
    'https://ap.rdcpix.com/4da695b2738254f8c0efb641e73912b1l-m902236204rd-w1280_h960.webp',
    'https://ap.rdcpix.com/4da695b2738254f8c0efb641e73912b1l-m2568491142rd-w1280_h960.webp',
    'https://ap.rdcpix.com/4da695b2738254f8c0efb641e73912b1l-m405109484rd-w1280_h960.webp',
    
  ],
  Price: 117000,
  Location: '11992 Merrill, Hamburg, MI 48139',
  Size: '2.22 Acres',
  Phone: '677 422 3535'
}
]


const NearByCard = ({data, onPress, navigation}) => (
  <TouchableOpacity  
  onPress={onPress}
  style={styles.nearByView}>
     <TouchableOpacity style={styles.heartBtn} onPress={() => navigation.navigate('ArchitecturalDetails')} >
       <FText fontSize="large" fontWeight={900} color={colours.secondary}> Select </FText>
      </TouchableOpacity>
    <Image
      source={{uri: data.Images[0]}}
      style={styles.nearByImg}
    />
    <View style={styles.tagnearView}>
      <FText fontSize="large" fontWeight={900} color={colours.secondary}>
      ${data.Price.toLocaleString()}{" "}
      </FText>
    </View>
    <View
          style={{ ...styles.locationView, marginBottom: 0, marginLeft: 4 }}
        >
          <Image
            source={require(ImgPath + "location.png")}
            style={styles.location}
          />
          <FText
            fontSize="normal"
            fontWeight="700"
            color={colours.typography_80}
          >
            {data.Location}
          </FText>
        </View>
      <View style={styles.ratingView}>
        <FText
          fontSize="normal"
          fontWeight="700"
          color={colours.typography_80}
        >
        Size: {data.Size}
        </FText> 
        <View style={{flexDirection: 'row', marginLeft: 80}}>
        <Icon name="phone" size={15} color={colours.primary}/>
        <FText size='normal' fontWeight={900} color={colours.primary}> {data.Phone} </FText>
        </View>

      </View>
      
    
    
  </TouchableOpacity>
);



const LandDetail = ({ navigation }) => {

  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredLandData, setFilteredLandData] = useState(LandData);


  const slideAnim = useRef(new Animated.Value(1000)).current; // Initial position off-screen

  const handleCardPress = (images) => {
    setSelectedImages(images);
    setModalVisible(true);
  };
  const openModal = () => {
    setFilterModalVisible(true);
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
    }).start(() => setFilterModalVisible(false));
  };

  const applyFilter = (criteria) => {
    let filteredData;
    if (criteria === 'highPrice') {
      // Sort by high price (descending order)
      filteredData = [...LandData].sort((a, b) => b.Price - a.Price);
    } else if (criteria === 'lowPrice') {
      // Sort by low price (ascending order)
      filteredData = [...LandData].sort((a, b) => a.Price - b.Price);
    }

    setFilteredLandData(filteredData); // Update state with filtered data
    setActiveFilter(criteria); // Set the active filter
    closeModal(); // Close the modal
  };

  return (
        
    <ScrollView style={styles.mainContainer}>
       <View > 
        <BackButton> </BackButton>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}> 
          <View> 
         <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{marginTop: 120, marginLeft: 30}} >
          Select your land 
        </FText>
        <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 30}}> Choose a perfect area to build your house </FText>
        </View>
        <TouchableOpacity style = {styles.filterButton } onPress={openModal}> 
            <Image source={require(filter)}/>
            </TouchableOpacity>
            </View>

        {/* <FText fontSize="normal" fontWeight={400} color={colours.typography_80} style={{marginTop: 2, marginLeft: 30}}> Choose a perfect area to build your house </FText> */}
        <FlatList
            data={filteredLandData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <NearByCard  data={item} onPress={()  => handleCardPress(item.Images)} navigation={navigation}/>}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Carousel
        images={selectedImages}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

<Modal
        transparent={true}
        visible={filterModalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >

     <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>
            <FText fontSize='h6' fontWeight={700} color={colours.typography_60} style={{marginBottom: 20}}>Filter With</FText>
            <Pressable style={styles.button} onPress={() => applyFilter('highPrice')} >
              <FText fontSize='normal' fontWeight={700} color={colours.typography_60}>High Price {activeFilter === 'highPrice' && '✔️'} </FText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => applyFilter('lowPrice')}>
              <FText fontSize='normal' fontWeight={700} color={colours.typography_60} >Low Price {activeFilter === 'lowPrice' && '✔️'} </FText>
            </Pressable>
            
            <Pressable style={[styles.button, styles.buttonClose]} 
             onPress={() => {
              setFilteredLandData(LandData);
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

const styles = StyleSheet.create({

  mainContainer: {
      backgroundColor: colours.secondary
  },
  filterButton: {
    marginTop: 120,
    marginRight: 15,
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
  heartBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: colours.primary,
    position: 'absolute',
    top: '14%',
    right: 6,
    zIndex: 999,
},
  nearByView: {
    width: "90%",
    height: 340,
    backgroundColor: "#F5F4F8",
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 20
  },
  nearByImg: {
    width: "100%",
    height: "86%",
    alignSelf: "center",
    resizeMode: "contain",
    borderRadius: 20
  
    
  },
  rateingandLocation: {
    marginTop: 4,
    flexDirection: "row",
    marginLeft: 16,
  },
  heartnearImg: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    position: "absolute",
    top: 15,
    right: 14,
  },
  tagnearView: {
    alignItems: 'center',
    position: "absolute",
    bottom: "26%",
    right: 14,
    backgroundColor: colours.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    width: '40%',
    height: '10%'
  },
  ratingView: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15
  },
  locationView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
    marginTop: -11
  },
  location: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  bgImageContainer: {
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    height: 360,
    alignSelf: 'center',
    borderRadius: 20
    // marginTop: '8%',
    
}
})

export default LandDetail;