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




const InvestorGroups = () => {

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
   

    return (
        <ScrollView style={styles.mainContainer}>
      <BackButton />
      {/* <View style={{alignItems: 'center'}}>
        <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 120,}}>
        Investor Group Chat
        </FText>
        </View> */}

        <TouchableOpacity style={styles.ListingContainer} onPress={() =>navigation.navigate('CreateGroup1') } >
            <Icons name="pluscircle" size={30} color='#8BC83F' />
            <FText fontSize="large" fontWeight={700} color={colours.primary}> New Group </FText>
          </TouchableOpacity>
 
          <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 20, marginLeft: 20}}> 
            <View style={styles.optionIcon}> 
            <FontAwesome6 name="user-group" size={25} color={colours.primary} />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Your Groups </FText>
         
          </View>

          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10, marginTop: 10, marginLeft: 20,  backgroundColor: '#F4F5F8', height :50,  padding: 5, width: '90%', borderRadius:20}}> 
            <View style={styles.optionIcon}> 
            <Image
                  source={require(ImgPath + "personImg.png")}
                  style={styles.pic}
                />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10}} > Group 1 </FText>
         
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10, marginTop: 10, marginLeft: 20,  backgroundColor: '#F4F5F8', height :50,  padding: 5, width: '90%', borderRadius:20}}> 
            <View style={styles.optionIcon}> 
            <Image
                  source={require(ImgPath + "personImg.png")}
                  style={styles.pic}
                />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10}} > Group 2 </FText>
         
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10, marginTop: 10, marginLeft: 20,  backgroundColor: '#F4F5F8', height :50,  padding: 5, width: '90%', borderRadius:20}}> 
            <View style={styles.optionIcon}> 
            <Image
                  source={require(ImgPath + "personImg.png")}
                  style={styles.pic}
                />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10}} > Group 3 </FText>
         
          </TouchableOpacity>

          <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 20, marginLeft: 20}}> 
            <View style={styles.optionIcon}> 
            <FontAwesome6 name="user-group" size={25} color={colours.primary} />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Public Groups </FText>
         
          </View>

          <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5,borderRadius:20, width: '90%'}}> 
          <View style={{flexDirection: 'row'}}> 
          <Image
                  source={require(ImgPath + "personImg.png")}
                  style={styles.pic}
                />
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10}}  > Group 1 </FText>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} > 
          <FText fontSize="small" fontWeight={700} color={colours.white}>
            Join
          </FText>

          </TouchableOpacity>
        </View>

        <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5,borderRadius:20, width: '90%', marginTop: 10}}> 
          <View style={{flexDirection: 'row'}}> 
          <Image
                  source={require(ImgPath + "personImg.png")}
                  style={styles.pic}
                />
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{marginTop: 10}}  > Group 2 </FText>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} > 
          <FText fontSize="small" fontWeight={700} color={colours.white}>
            Join
          </FText>

          </TouchableOpacity>
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
            <View style={{flexDirection: 'row'}}> 
            <MaterialIcons name='error' size={24} color={colours.primary} style={{marginTop: 1, marginRight: 5}} />
            <FText fontSize="large" fontWeight="700" color={colours.typography_60}>
              Are you sure you want to join this group?
            </FText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <TouchableOpacity style={styles.button}  >
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Yes
        </FText>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {marginLeft: 10 }]} onPress ={() => setModalVisible(false)} >
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Cancel
        </FText>
         </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>




        </ScrollView>

    )
}

export default InvestorGroups;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    ListingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#F4F5F8',
        width: '70%',
        marginLeft: 50,
        marginTop: 100,
        marginBottom: 21,
        borderRadius: 10
    
      },
      pic: {
        width: 42,
        height: 42,
      borderRadius: 21,
      },
      button: {
        backgroundColor: '#8BC83F',
        height: 30,
        width: '20%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center'
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
    },
    modalView: {
        width: 350,
        backgroundColor: 'white',
        borderRadius: 20,
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