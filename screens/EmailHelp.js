import { FlatList, ScrollView, TouchableOpacity, View, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app, db } from '../firebaseconfig'; // Ensure correct import
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import Icon from 'react-native-vector-icons/FontAwesome';
import fonts from "../constants/fonts";
import DropDownPicker from 'react-native-dropdown-picker';

const EmailHelp = () => {
    const [message, setMessage] = useState(null);
    return (
        <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
        How can we help you?
        </FText>

        <View style={styles.inputContainer}>
        <FText fontSize="medium" fontWeight={400} color={colours.primary} style={styles.label}>
        Please type a message here, we will respond to your request via email within 2-3 days.
        </FText>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          placeholderTextColor={"#A1A5C1"}
          onChangeText={message}
          value={setMessage}
        />
      </View>

      <TouchableOpacity  style={styles.button}  >
          
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
        marginTop: 21,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10
      },

      imageContainer : {
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
      imagesConatiner : {
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
        fontFamily:fonts.LatoRegular,
        
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