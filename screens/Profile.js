import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, Animated, Pressable } from 'react-native';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { app , db, auth} from '../firebaseconfig'; // Adjust the path as necessary
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import { colours } from '../constants/colours';
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getAuth, signOut, updatePassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'



const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(500)).current;


  const openModal = () => {
    setSupportModalVisible(true);
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
    }).start(() => {
      setSupportModalVisible(false);
    });
  };




  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore(app);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError('No such document!');
          }
        } else {
          setError('No authenticated user found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Redirect to the login screen
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
    setSignOutModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
  
    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
  
      // Delete the user from Firebase Authentication
      await user.delete();
  
      // Redirect to a post-deletion screen
      navigation.replace('Signup'); // Redirect to signup after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      // Optionally handle error logic, like showing a toast or another UI notification
    }
    setDeleteModalVisible(false);
  };

  const handleEditProfile = () => {
    // Navigate to the edit profile screen (create this screen if it doesn't exist)
    navigation.navigate('EditProfile', { userData: userData }); // Pass current user data to the edit screen
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show error message if any
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      
      <BackButton></BackButton>
      <View style={styles.container}> 
      {userData?.profilePic ? (
        <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
      ) : (
        <View style={styles.profilePic} />
      )}
      <FText fontSize='h5' fontWeight={900} color={colours.primary}>{userData?.fullName || 'User Name'}</FText>
      <FText fontSize='large' fontWeight={400}>{userData?.email || 'User Email'}</FText>
      </View> 
      <View style={{flexDirection: 'column', marginTop: 60}}> 
        <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5}}> 
          <View style={{flexDirection: 'row', marginBottom: 10}}> 
          <FontAwesome5 name='user-edit' size={24} color={colours.primary} style={styles.optionIcon} />
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Edit Profile </FText>
          </View>
          <TouchableOpacity style={{marginTop: -5}} onPress={handleEditProfile}> 
            <Icon name='arrowright' size={30} color={colours.primary}> </Icon>

          </TouchableOpacity>
        </View>
        <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginTop: 15, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5}}> 
          <View style={{flexDirection: 'row', marginBottom: 10}}> 
            <View style={styles.optionIcon}> 
          <Icon name='delete' size={24} color={colours.primary}  />
          </View>
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Delete Account </FText>
          </View>
          <TouchableOpacity style={{marginTop: -5}} onPress={() => setDeleteModalVisible(true)}> 
            <Icon name='arrowright' size={30} color={colours.primary}> </Icon>

          </TouchableOpacity>
        </View>

        <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}> 
            <MaterialIcons name='error' size={24} color={colours.primary} style={{marginTop: 1, marginRight: 5}} />
            <FText fontSize="large" fontWeight="700" color={colours.typography_60}>
              Are you sure you want to delete the account?
            </FText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <TouchableOpacity style={styles.button} onPress={handleDeleteAccount} >
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Yes
        </FText>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {marginLeft: 10 }]} onPress ={() => setDeleteModalVisible(false)} >
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Cancel
        </FText>
         </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        

        <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginTop: 15, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5}}> 
          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10}} onPress={() => setSignOutModalVisible(true)}> 
          <MaterialIcons name='logout' size={24} color={colours.danger} style={styles.optionIcon} />
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Sign out </FText>
          </TouchableOpacity>
          
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={signOutModalVisible}
        onRequestClose={() => {
          setSignOutModalVisible(!signOutModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}> 
            <MaterialIcons name='error' size={24} color={colours.primary} style={{marginTop: 1, marginRight: 5}} />
            <FText fontSize="large" fontWeight="700" color={colours.typography_60}>
              Are you sure you want to log out?
            </FText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <TouchableOpacity style={styles.button}  onPress={handleLogout}>
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Yes
        </FText>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.button, {marginLeft: 10 }]} onPress ={() => setSignOutModalVisible(false)} >
        <FText fontSize="medium" fontWeight={700} color={colours.white}> 
            Cancel
        </FText>
         </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      </View>
      <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginTop: 15, backgroundColor: '#F4F5F8', height : 50, alignItems: 'center', padding: 5}}> 
          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 10}} onPress={() => openModal()}> 
          <MaterialIcons name='help-center' size={24} color={colours.primary} style={styles.optionIcon} />
          <FText fontSize='large' fontWeight={700} color={colours.primary} > Support Center </FText>
          </TouchableOpacity>
          
        </View>

        <Modal
        transparent={true}
        visible={supportModalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >

        <Pressable style={styles.supportmodalOverlay} onPress={closeModal}>
          <Animated.View style={[styles.supportmodalView, { transform: [{ translateY: slideAnim }] }]}>

            <View >

            <FText fontSize='h5' fontWeight={700} color={colours.primary} style={{marginLeft: 5}} > Support </FText>
              
              <View style={{marginBottom: 20}}> 
              

            <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginTop: 30, backgroundColor: '#F4F5F8', height : 100,  padding: 5, width: '100%'}}> 
          <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 20}}> 
            <View style={styles.optionIcon}> 
          <SimpleLineIcons name='exclamation' size={20} color={colours.primary}  />
          </View>
          <FText fontSize='medium' fontWeight={700} color={colours.primary} > Help Center </FText>
         
          </View>
          <TouchableOpacity style={{marginTop: -5, marginTop: 20}} onPress={() => { closeModal(); navigation.navigate('FAQ')}} > 
            <Icon name='arrowright' size={20} color={colours.primary}> </Icon>

          </TouchableOpacity>
        </View>
        <FText fontSize='small' fontWeight={400} color={colours.primary} style={{marginTop: -45, marginLeft: 10}} > Find out about how CommunityScape works </FText>

        </View>
              
        <View style={{marginBottom: 20}}> 
              

              <View style= {{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginTop: 30, backgroundColor: '#F4F5F8', height : 90,  padding: 5, width: '100%'}}> 
            <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 20}}> 
              <View style={styles.optionIcon}> 
            <Ionicons name='help-circle-outline' size={24} color={colours.primary}  />
            </View>
            <FText fontSize='medium' fontWeight={700} color={colours.primary} > Contact Us </FText>
           
            </View>
            <TouchableOpacity style={{marginTop: -5, marginTop: 20}} onPress={() => { closeModal(); navigation.navigate('EmailHelp')}} > 
              <Icon name='arrowright' size={20} color={colours.primary}> </Icon>
  
            </TouchableOpacity>
          </View>
          <FText fontSize='small' fontWeight={400} color={colours.primary} style={{marginTop: -38, marginLeft: 10}} > Resolve a specific issue </FText>
  
          </View>

              {/* <TouchableOpacity onPress={() => fnOnShare()} style={{ backgroundColor: "#F5F4F8", width: '90%', padding: 20, alignSelf: 'center', marginTop: 20, borderRadius: 10 }}>
                <FText fontSize='large' fontWeight={700} color={colours.primary} style={{ alignSelf: 'center' }}> Share </FText>
              </TouchableOpacity> */}
            </View>

          </Animated.View>
        </Pressable>
      </Modal>

       
    </View>
    

   
    
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colours.secondary,
    flex: 1,
   
  },

 

  container : {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
    marginTop : 90
  },
  error: {
    fontSize: 18,
    color: 'red',
  },

  supportmodalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
 supportmodalView: {
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
},
button: {
  backgroundColor: '#8BC83F',
   height: 30,
   width: '30%',
   marginTop: 20,
   alignItems: 'center',
   justifyContent: 'center',
   borderRadius: 10,
   marginBottom: 10,
   alignSelf: 'center',
   
},
});

export default Profile;