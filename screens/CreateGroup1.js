import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable, ActivityIndicator, Alert } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButtons'
const ImgPath = "../assets/images/Home/";
import Icons from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { auth, db } from '../firebaseconfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import useUserManager from '../hooks/useUserManager';

const CreateGroup1 = () => {

  const navigation = useNavigation();
  const { currentUser } = useUserManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => { fetchUsers(); }, [currentUser]);

  const fetchUsers = async () => {
    setLoader(true);
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollection, where('email', '!=', currentUser?.email)));
      const usersList = querySnapshot?.docs?.map(doc => ({ id: doc.id, ...doc.data() }))

      setUsers(usersList);
    } catch (err) {
      console.log('Error fetching users:', err);
    } finally {
      setLoader(false);
    }
  };

  const toggleIconVisibility = (user) => {
    const userId = user?.id;
    const isAlreadyExist = members?.some((member) => member?.id == userId);
    if (isAlreadyExist) {
      const updatedMembers = members?.filter((member) => member?.id != userId);
      setMembers(updatedMembers);
    } else {
      setMembers((pre) => [...pre, user]);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = members?.some((member) => member?.id == item?.id);
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height: 50, alignItems: 'center', padding: 5, borderRadius: 20, width: '90%', marginTop: 10 }}
        onPress={() => toggleIconVisibility(item)}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: item?.profilePic }} style={styles.pic} />
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ marginTop: 10, marginLeft: 10 }}>{item?.fullName}</FText>
        </View>
        {isSelected && <>
          <AntDesign name="checkcircle" size={25} color="#8BC83F" />
        </>
        }

      </TouchableOpacity>
    )
  };

  const fnNext =()=> {
    if(members?.length > 0) {
      setMembers([]); 
      navigation.navigate('CreateGroup2', { members, allUsers: users })
    } else {
      Alert.alert(
        'Warning',
        'Sorry, you need to add any member first!'
      )
    }
  }

  return (
    <>
      <ScrollView style={styles.mainContainer} contentContainerStyle={{flex:1, marginBottom: 90}} >
        <BackButton />
        <View style={{ alignItems: 'center' }}>
          <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 100, }}>
            Add Members
          </FText>
        </View>

        <View style={styles.searchView}>
          <Image
            source={require(ImgPath + "search.png")}
            style={{ width: 20, height: 20 }}
          />
          <TextInput
            placeholder="Search Name or contact"
            placeholderTextColor={"#A1A5C1"}
            style={{ flex: 1, marginLeft: 10 }}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        {
          loader ? <View style={{flex:0.8, alignItems:'center', justifyContent:'center'}} >
            <ActivityIndicator size={'large'} color={colours.primary} />
          </View> : <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        }

      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={fnNext}>
        <FText fontSize="small" fontWeight={700} color={colours.white}>
          Next
        </FText>
      </TouchableOpacity>
    </>
  )
}

export default CreateGroup1;



const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: colours.secondary,
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F4F5F8',
    height: 60,
    width: '90%',
    borderRadius: 15,
    marginTop: 20,
    paddingHorizontal: 10,
    zIndex: -1,
    marginLeft: 20
  },
  pic: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  button: {
    backgroundColor: '#8BC83F',
    height: 50,
    width: '60%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
})