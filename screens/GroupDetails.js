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


const GroupDetails = () => {
    const [users, setUsers] = useState([
        { id: '1', name: 'Esha Ahmed', image: require(ImgPath + "personImg.png"), isIconVisible: false },
        { id: '2', name: 'John Doe', image: require(ImgPath + "personImg.png"), isIconVisible: false },
        { id: '3', name: 'Jane Smith', image: require(ImgPath + "personImg.png"), isIconVisible: false },
      ]);
    
      const renderItem = ({ item }) => (
        <TouchableOpacity
          style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5,borderRadius:20, width: '90%', marginTop: 10}}
          onPress={() => toggleIconVisibility(item.id)} // Toggle icon visibility for the clicked user
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.image} style={styles.pic2} />
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
        
         <View style = {{alignItems: 'center', justifyContent: 'center', marginTop: 120}} > 
          <Image
          source={require(ImgPath + "personImg.png")}
          style={styles.pic}
                />
         <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 20}}> Group Name</FText>
         <View style={{flexDirection: 'row'}}> 
         <FText fontSize="small" fontWeight={400} color={colours.primary} style={{ marginTop: 3}}> Group</FText>
         <FText fontSize="small" fontWeight={400} color={colours.primary} style={{ marginTop: 3}}> {" "} 8 members</FText>
         </View>
            </View>
            <View style={{marginTop: 20}}> 

            <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      </View>

    <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginTop: 10,  height : 50, alignItems: 'center', padding: 5}}> 
          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10}} > 
          <MaterialIcons name='logout' size={24} color={colours.danger} style={styles.optionIcon} />
          <FText fontSize='medium' fontWeight={700} color={colours.primary} > Exit Group </FText>
          </TouchableOpacity>
          
        </View>
          </ScrollView>

    )

}

export default GroupDetails;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    
    pic: {
        width: 100,
        height: 100,
      borderRadius: 50,
      },

      pic2: {
        width: 40,
        height: 40,
      borderRadius: 20,
      },

    })