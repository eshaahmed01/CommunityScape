import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable } from 'react-native'
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


const CreateGroup1 = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isIconVisible, setIsIconVisible] = useState(false);
    const [users, setUsers] = useState([
        { id: '1', name: 'Esha Ahmed', image: require(ImgPath + "personImg.png"), isIconVisible: false },
        { id: '2', name: 'John Doe', image: require(ImgPath + "personImg.png"), isIconVisible: false },
        { id: '3', name: 'Jane Smith', image: require(ImgPath + "personImg.png"), isIconVisible: false },
      ]);

      const toggleIconVisibility = (userId) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isIconVisible: !user.isIconVisible } : user
          )
        );
      };
    
      const renderItem = ({ item }) => (
        <TouchableOpacity
          style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5,borderRadius:20, width: '90%', marginTop: 10}}
          onPress={() => toggleIconVisibility(item.id)} // Toggle icon visibility for the clicked user
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.image} style={styles.pic} />
            <FText  fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10, marginLeft: 10}}>{item.name}</FText>
          </View>
          {item.isIconVisible && (
            <TouchableOpacity>
              <AntDesign name="checkcircle" size={25} color="#8BC83F" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    


    

    

    return (
        <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View style={{alignItems: 'center'}}>
        <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 100,}}>
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

            <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateGroup2')}>
          <FText fontSize="small" fontWeight={700} color={colours.white}>
            Next
          </FText>
        </TouchableOpacity>
        </ScrollView>


    )
}

export default CreateGroup1;



const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
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
        alignSelf: 'center'
      },
})