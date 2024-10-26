import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { colours } from '../constants/colours';
import fonts from '../constants/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign'
import man from '../assets/images/profile1.png';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseconfig'; 

const CustomDrawer = (props) => {

    const [userData, setUserData] = useState(null);

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

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.Main}>
                <View style={styles.ProfileBox}>
                    <View style={styles.ProfilePicBox}>
                        <Image source={{ uri: userData?.profilePic }} style={styles.ImageStyling} />
                    </View>
                    <View style={{ marginLeft: "2%" }}>
                        <Text style={styles.ProfileName}>{userData?.fullName}</Text>
                        <Text style={styles.ProfileEmail}>{userData?.email}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    <View style={{ height: 1, backgroundColor: colours.aslo_gray, width: '80%' }} />
                </View>
                <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false} >
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </View>
        </ScrollView>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
    Main: {
        flex: 1,
        backgroundColor: colours.secondary
    },
    ProfileBox: {
        marginTop: 30,
        height: 120,
        paddingLeft: '4%',
        flexDirection: "row",
        alignItems: "center",
    },
    ProfilePicBox: {
        height: 70,
        width: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageStyling: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    ProfileName: {
        fontFamily: fonts.LatoRegular,
        fontWeight: '900',
        fontSize: 20,
        color: colours.primary,
        textAlignVertical: "center"
    },
    ProfileEmail: {
        fontFamily: fonts.LatoRegular,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 21,
        color: colours.primary,
        textAlignVertical: "center"
    },
    CloseIcon: {
        position: "absolute",
        right: "4%",
        top: "5%"
    },
})