import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, TextInput, FlatList } from 'react-native';
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import FText from '../components/Ftext';
import { db } from "../firebaseconfig";
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore";
import { useEffect } from 'react';
import BackButton from '../components/BackButtons';

const Profile = ({navigation}) => {
  const [search, setSearch] = useState('')
  const [estates, setEstates] = useState([]);
  const [otherEstates, setOtherEstates] = useState([]);
  const [mergedEstates, setMergedEstates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


//Fetching Featured Estates
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, "Estates"))
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEstates(docsArray);
      console.log("Fetched featured Estates: ", estates);
      
      
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  fetchDocuments();
}, []);

//fetching unfeatured data
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const q = query(collection(db, "OtherEstates"))
      const querySnapshot = await getDocs(q);
      const docsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOtherEstates(docsArray);
      const merged = [...estates, ...otherEstates];
      console.log('Merged Estates are: ', merged);
      setMergedEstates(merged);

    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  fetchDocuments();
}, []);


  const handleSearch = (text) => {
    setSearch(text);
    const newData = mergedEstates.filter(item => item.Name.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(newData);
  };

console.log(filteredData?.length);

  const Item = ({ id, name, imageUrl, rating, location,price }) => (
    <TouchableOpacity style={styles.item} onPress={()=> navigation.navigate('PropertyDetail', { id: id, location: location, name: name })}>
      <ImageBackground source={ { uri: imageUrl}} style={styles.imageBackground} imageStyle={styles.image}>
        <Image style={{height:25,width:25,marginLeft:'auto',marginRight:"5%",marginTop:'5%'}} source={require('../assets/images/heart.png')}/>
        {/* <Icon name="heart-outline" size={24} color="#fff" style={styles.heartIcon} /> */}
        <View style={{height:25,width:72,backgroundColor:'#1F4C6B',borderRadius:20,marginTop:'auto',marginLeft:'auto',marginBottom:'5%',marginRight:'5%',alignItems:'center',justifyContent:'center'}}>
<FText fontSize='small' fontWeight={400} color={colours.white}>${price}</FText>
        </View>
      </ImageBackground>
      <FText fontSize='normal' fontWeight={700} color={colours.typography_60} style={{marginLeft:'8%', marginTop:"5%"}}>{name}</FText>
      <View style={styles.infoRow}>
      <Image style={{height:13,width:13}} source={require('../assets/images/star.png')}/>
  
        <FText  fontSize='small' fontWeight={700} color={colours.typography_60} style={styles.rating}>{rating}</FText>
        <Image resizeMode='contain' style={{height:9,width:9}} source={require('../assets/images/loc.png')}/>

        <FText  fontWeight={700} color={colours.typography_60} style={styles.location}>{location}</FText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
<ScrollView>
<View style={{marginTop: 21}}> 
<BackButton></BackButton>
<View style={{alignItems: 'center', width: '100%'}}> 
<FText fontSize='h5' fontWeight={700} color={colours.typography_60} style={{marginTop: 50, marginBottom: 20}}>Search</FText>
</View>
</View>
<View style={{height:55,backgroundColor:'#f5f4f8',elevation:2,width:'90%',alignSelf:'center',borderRadius:20,flexDirection:'row',alignItems:"center",marginTop:'5%'}}>
<TextInput value={search}
        onChangeText={handleSearch} style={{width:'85%',color: colours.typography_60, padding: 15, fontSize: 20}}/>
<Image style={{height:20,width:20}} source={require('../assets/images/Search/search.png')}/>
</View>

{search.trim() !== '' && (
  <>
    <View style={{flexDirection:'row', alignItems:'center', marginLeft:'10%', marginTop: 20, marginBottom: 10}}>
      <FText color={colours.typography_60} fontSize='large' fontWeight={400} style={{marginTop:'2%', marginRight:"auto"}}>
        <FText color={colours.typography_60} fontSize='large' fontWeight={400}>
          Found {filteredData?.length == undefined ? '0' : filteredData?.length}
        </FText> {filteredData?.length === 1 ? 'estate' : 'estates'}
      </FText>
    </View>

    {filteredData?.length == 0 || filteredData?.length == undefined ? (
      <View style={{alignItems:'center', marginTop:'30%'}}>
        <Image style={{height:142, width:142}} source={require('../assets/images/Search/no.png')} />
        <Text style={{color:colours.typography_80, fontFamily:fonts.LatoBold, fontSize:25, marginTop:'5%'}}>
          <Text style={{fontFamily:fonts.LatoRegular}}>Search</Text> not found
        </Text>
        <FText style={{marginTop:'5%', width:"80%", textAlign:'center'}} fontSize='small' fontWeight={400} color={colours.typography_60}>
          Sorry, we can’t find the real estates you are looking for. Maybe, a little spelling mistake?
        </FText>
      </View>
    ) : (
      <View> 
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <Item
             id={item.id}
              name={item.Name}
              imageUrl={item.ImageURL}
              rating={item.Rating}
              location={item.Location}
              price={item.Price}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    )}
  </>
)}
<View style={{height:20}}/>
</ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colours.secondary

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  item: {
    height:231,
    width:180,
    margin: 6,
    backgroundColor: '#F5F4F8',
    borderRadius: 10,
    overflow: 'hidden',
    elevation:6

  },
  imageBackground: {
    height: 160,
    width:144,
    alignSelf:'center',
    marginTop:"5%"
  },
  image: {
    width: 144,
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  name: {
    fontSize: 12,
    color:colours.typography_80,
    fontFamily:fonts.LatoBold,
    marginLeft:'8%',
    marginTop:"5%"

  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop:'7%'
  },
  rating: {
    marginLeft: 5,
    marginRight: 15,
    

  },
  locationIcon: {
    marginLeft: 5,
  },
  location: {
    marginLeft: 2,
    marginRight: 15,
    fontSize: 11
   
  },
});

export default Profile;

