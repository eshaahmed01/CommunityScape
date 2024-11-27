import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions, Modal, Animated, Pressable, Alert, ActivityIndicator } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import fonts from '../constants/fonts';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButtons'
const ImgPath = "../assets/images/Home/";
import Icons from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../firebaseconfig';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import useUserManager from '../hooks/useUserManager';

const InvestorGroups = () => {

  const navigation = useNavigation();
  const { currentUser } = useUserManager();

  const [modalVisible, setModalVisible] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [loaderGroupId, setLoaderGroupId] = useState(null);
  const [loader, setLoader] = useState(false);

  // useEffect(() => { setLoader(true); fnCallFetchGroups(); }, [currentUser]);
  useFocusEffect(
    useCallback(()=>{
      setLoader(true); 
      fnCallFetchGroups();
    },[currentUser])
  )

  const fnCallFetchGroups = () => {
    fetchGroups().then((payload) => {
      let updatedUserGroups = payload?.userGroups?.filter((group)=> group?.members?.find((member)=> member?.id == currentUser?.id));
      setUserGroups(updatedUserGroups);
      setPublicGroups(payload?.publicGroups);
    }).catch((error) => {
      console.log(error)
    });
  };

  const fetchGroups = async () => {
    const userId = currentUser?.id;
    try {
      const groupsRef = collection(db, "groups");
      const groupSnapshot = await getDocs(groupsRef);

      const userGroups = [];
      const publicGroups = [];

      groupSnapshot?.forEach((doc) => {
        const data = doc.data();
        if (data.adminId === userId) {
          userGroups.push({ id: doc.id, ...data });
        } else if (data.members.length > 0) {
          publicGroups.push({ id: doc.id, ...data });
        }
      });

      return { userGroups, publicGroups };
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoader(false);
    }
  };

  const fnNavigateToUserGroup = async (group) => {
    navigation.navigate('GroupChatScreen', { group, userId: currentUser?.id })
  };

  const fnNavigateToPublicGroup = async (group) => {
    const isUserJoined = group?.members?.some((member) => member?.id == currentUser?.id);
    if (isUserJoined) {
      navigation.navigate('GroupChatScreen', { group, user: currentUser })
    } else {
      Alert.alert(
        'Warning',
        'Oops! Need to join this group first'
      )
    }
  };

  const fnGroupJoin = async (groupId) => {
    setLoaderGroupId(groupId)
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      const groupData = groupSnap.data();
      const updatedMembers = [...groupData?.members, currentUser];
      await updateDoc(groupRef, { members: updatedMembers });
      fnCallFetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setTimeout(() => { setLoaderGroupId(null); }, 1000);
    }
  };

  const fnLeaveGroup = async (groupId) => {
    setLoaderGroupId(groupId)
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      const groupData = groupSnap.data();
      const updatedMembers = groupData?.members?.filter((member)=> member?.id !== currentUser?.id);
      await updateDoc(groupRef, { members: updatedMembers });
      fnCallFetchGroups();
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setTimeout(() => { setLoaderGroupId(null); }, 1000);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps='always' contentContainerStyle={{ flex: 1 }} style={styles.mainContainer}>
      <BackButton />

      <TouchableOpacity style={styles.ListingContainer} onPress={() => navigation.navigate('CreateGroup1')} >
        <Icons name="pluscircle" size={30} color='#8BC83F' />
        <FText fontSize="large" fontWeight={700} color={colours.primary}> New Group </FText>
      </TouchableOpacity>

      {
        loader ? <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} color={colours.primary} />
        </View>
          : <>
            {userGroups?.length > 0 && <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 20, marginLeft: 20 }}>
              <View style={styles.optionIcon}>
                <FontAwesome6 name="user-group" size={25} color={colours.primary} />
              </View>
              <FText fontSize='large' fontWeight={700} color={colours.primary} > Your Groups </FText>

            </View>}

            {userGroups?.length > 0 &&
              userGroups?.map((group) => {
                return (
                  <TouchableOpacity onPress={() => fnNavigateToUserGroup(group)} style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, marginLeft: 20, backgroundColor: '#F4F5F8', height: 50, padding: 5, width: '90%', borderRadius: 20 }}>
                    <View style={styles.optionIcon}>
                      <Image
                        source={{ uri: group?.image }}
                        style={styles.pic}
                      />
                    </View>
                    <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ marginTop: 10 }} > {group?.name} </FText>

                  </TouchableOpacity>
                )
              })}

            {publicGroups?.length > 0 && <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, marginLeft: 20 }}>
              <View style={styles.optionIcon}>
                <FontAwesome6 name="user-group" size={25} color={colours.primary} />
              </View>
              <FText fontSize='large' fontWeight={700} color={colours.primary} > Public Groups </FText>

            </View>}

            {publicGroups?.length > 0 && publicGroups?.map((group) => {
              const isUserAlreadyJoined = group?.members?.some((member) => member?.id == currentUser?.id);
              return (
                <TouchableOpacity onPress={() => fnNavigateToPublicGroup(group)} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, marginLeft: 20, backgroundColor: '#F4F5F8', height: 50, alignItems: 'center', padding: 5, borderRadius: 20, width: '90%' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: group?.image }}
                      style={styles.pic}
                    />
                    <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ marginTop: 10 }}  > {group?.name} </FText>
                  </View>
                  {isUserAlreadyJoined ?
                    <TouchableOpacity disabled={loaderGroupId == group?.id} style={[styles.button, { backgroundColor: 'red' }]} onPress={() => fnLeaveGroup(group?.id)} >
                      {group?.id == loaderGroupId ? <ActivityIndicator size={'small'} color={colours.white} />
                        : <FText fontSize="small" fontWeight={700} color={colours.white}>
                          Leave
                        </FText>}
                    </TouchableOpacity>
                    : <TouchableOpacity disabled={loaderGroupId == group?.id} style={styles.button} onPress={() => fnGroupJoin(group?.id)} >
                      {group?.id == loaderGroupId ? <ActivityIndicator size={'small'} color={colours.white} />
                        : <FText fontSize="small" fontWeight={700} color={colours.white}>
                          Join
                        </FText>}
                    </TouchableOpacity>
                  }
                </TouchableOpacity>
              )
            })}
          </>
      }

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
            <View style={{ flexDirection: 'row' }}>
              <MaterialIcons name='error' size={24} color={colours.primary} style={{ marginTop: 1, marginRight: 5 }} />
              <FText fontSize="large" fontWeight="700" color={colours.typography_60}>
                Are you sure you want to join this group?
              </FText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.button}  >
                <FText fontSize="medium" fontWeight={700} color={colours.white}>
                  Yes
                </FText>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={() => setModalVisible(false)} >
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