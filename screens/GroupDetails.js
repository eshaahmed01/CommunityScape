import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButtons'
const ImgPath = "../assets/images/Home/";
import Icons from 'react-native-vector-icons/AntDesign';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useUserManager from '../hooks/useUserManager';
import { db } from '../firebaseconfig';


const GroupDetails = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { currentUser } = useUserManager();

  const group = route?.params?.group;

  const [loader, setLoader] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height: 50, alignItems: 'center', padding: 5, borderRadius: 20, width: '90%', marginTop: 10 }}
      onPress={() => toggleIconVisibility(item.id)} // Toggle icon visibility for the clicked user
    >
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: item?.profilePic }} style={styles.pic2} />
          <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ marginTop: 10, marginLeft: 10 }}>{item?.fullName}</FText>
        </View>
        {item?.id == group?.adminId ? <Text style={{ marginLeft: 51, bottom: 10, fontSize: 12, fontWeight: '700' }} >{'admin'}</Text> : <></>}
      </View>
    </TouchableOpacity>
  );

  const fnLeaveGroup = async () => {
    setLoader(true);
    try {
      const groupRef = doc(db, "groups", group?.id);
      const groupSnap = await getDoc(groupRef);
      const groupData = groupSnap.data();
      const updatedMembers = groupData?.members?.filter((member) => member?.id !== currentUser?.id);
      await updateDoc(groupRef, { members: updatedMembers });
      navigation?.replace('InvestorGroups');
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setLoader(false);
    }
  };


  return (
    <ScrollView style={styles.mainContainer}>
      <BackButton />

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 120 }} >
        <Image
          source={{ uri: group?.image }}
          style={styles.pic}
        />
        <FText fontSize="h6" fontWeight="700" color={colours.primary} style={{ marginTop: 20 }}> {group?.name}</FText>
        <View style={{ flexDirection: 'row' }}>
          <FText fontSize="small" fontWeight={400} color={colours.primary} style={{ marginTop: 3 }}> Group</FText>
          <FText fontSize="small" fontWeight={400} color={colours.primary} style={{ marginTop: 3 }}> {" "} {group?.members?.length} members</FText>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>

        <FlatList
          data={group?.members}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginTop: 10, height: 50, alignItems: 'center', padding: 5 }}>
        <TouchableOpacity onPress={()=>fnLeaveGroup()} style={{ flexDirection: 'row', marginBottom: 10 }} >
          <MaterialIcons name='logout' size={24} color={colours.danger} style={styles.optionIcon} />
          {loader ?
            <ActivityIndicator size={'small'} color={colours.danger} style={{ marginLeft: 18 }} /> :
            <FText fontSize='medium' fontWeight={700} color={colours.primary} > Exit Group </FText>}
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