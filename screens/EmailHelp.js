import { FlatList, ScrollView, TouchableOpacity, View, Image, StyleSheet, TextInput, ActivityIndicator, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { app, auth, db } from '../firebaseconfig'; // Ensure correct import
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import Icon from 'react-native-vector-icons/FontAwesome';
import fonts from "../constants/fonts";
import DropDownPicker from 'react-native-dropdown-picker';
import * as MailComposer from 'expo-mail-composer';
import Icon2 from 'react-native-vector-icons/FontAwesome6'
import Icons from 'react-native-vector-icons/AntDesign';

const EmailHelp = () => {
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(()=>{
    fetchUserData();
  },[]);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));

        if (!userDoc.empty) {
          const data = userDoc.docs[0].data();
          setUserData({ name: data.fullName, email: data.email });
        } else {
          console.log('No user document found!');
        }
      } else {
        console.log('No user is signed in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fnSendMail = async() => {
    try {
      const emailsRef = collection(db, 'CustomerSupport');

      MailComposer.isAvailableAsync();
      const options = {
        recipients: ['eshaabbasi@gmail.com'],
        subject: 'Customer Support from Community Scape',
        body: message,
      };
      await MailComposer.composeAsync(options);
      
      setMessage(null);

      await addDoc(emailsRef, {
        email : userData?.email,
        message : message
      });
      
    } catch (error) {
      Alert.alert('Error', 'There was a problem sending the email.');
    }
  };


  return (
    <ScrollView keyboardShouldPersistTaps='always' style={styles.mainContainer}>
      <BackButton />
      <View>

      <View style={{ flexDirection: 'row' }}>
            <FText
              fontSize="h5"
              fontWeight="700"
              color={colours.primary}
              style={{ marginTop: 150, zIndex: -1, marginLeft: 30 }}
            >
              Hello {''}

              {userData?.fullName}!
            </FText>
            <Icon2 name="hands-clapping" size={40} color='#E4D00A' style={{ marginTop: 140 }} />
          </View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 5, marginLeft: 30 }}>
          How can we help you?
        </FText>

        <View style={styles.inputContainer}>
          <FText fontSize="small" fontWeight={400} color={colours.primary} style={styles.label}>
            Please type a message here, we will respond to your request via email within 2-3 days.
          </FText>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setMessage}
            value={message}
          />
        </View>

        <TouchableOpacity onPress={fnSendMail} style={styles.button}  >
          <FText fontSize="large" fontWeight={700} color={colours.white}>
            Send
          </FText>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )

}

export default EmailHelp;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: colours.secondary
  },
  inputContainer: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10
  },

  imageContainer: {
    height: 150,
    backgroundColor: '#F4F5F8',
    width: '100%',
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  imagesConatiner: {
    flexDirection: 'row',
    height: 150,
    backgroundColor: '#F4F5F8',
    width: '100%',
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 10
  },
  label: {
    marginBottom: 5
  },
  input: {
    height: 55,
    borderColor: '#F4F5F8',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#F4F5F8',
    color: colours.typography_80,
    fontFamily: fonts.LatoRegular,

  },
  textArea: {
    paddingTop: 10,
    height: 200,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#8BC83F',
    height: 50,
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center'
  }
})