import { FlatList, ScrollView, TouchableOpacity, View, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { app, auth, db } from '../firebaseconfig'; // Ensure correct import
import FText from "../components/Ftext";
import { colours } from "../constants/colours";
import BackButton from "../components/BackButtons";
import Icon from 'react-native-vector-icons/FontAwesome';
import fonts from "../constants/fonts";
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from "@react-navigation/native";

const Survey = () => {

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [satisfied, setSatisfied] = useState(null);
  const [feature, setFeature] = useState(null);
  const [usage, setUsage] = useState(null);
  const [design, setDesign] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [addFeature, setAddFeature] = useState(null);
  const [issues, setIssues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useFocusEffect(
    useCallback(() => {
      fetchUserData();

      return () => {
        fnEmptyStates();
        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
      }
    }, [])
  )

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));

        if (!userDoc.empty) {
          const data = userDoc.docs[0].data();
          console.log(data.fullName, data.email);
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const surveyRef = collection(db, 'Surveys');
      await addDoc(surveyRef, {
        name: userData?.name,
        email: userData?.email,
        satisfication_level: satisfied,
        favorite_feature: feature,
        app_usage: usage,
        design_rating: design,
        navigate_experience: navigation,
        suggested_features: addFeature,
        reported_issues: issues
      });
      fnEmptyStates();
    } catch (error) {
      console.log(error)
      fnEmptyStates();
    } finally {
      fnEmptyStates();
    }
  };

  const fnEmptyStates = () => {
    setLoading(false);
    setSatisfied(null);
    setFeature(null);
    setUsage(null);
    setDesign(null);
    setNavigation(null);
    setAddFeature(null);
    setIssues(null);
  }


  return (
    <ScrollView style={styles.mainContainer}>
      <BackButton />
      <View>
        <FText fontSize="h5" fontWeight="700" color={colours.primary} style={{ marginTop: 120, marginLeft: 30 }}>
          Help us improve our app!
        </FText>

        <View>
          <FText
            fontSize="medium"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 40, marginLeft: 28 }}
          >
            How satisfied are you with the app?
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "very satisfied", value: "very satisfied" },
                { label: "satisfied", value: "satisfied" },
                { label: "neutral", value: "neutral" },
                { label: "dissatisfied", value: "dissatisfied" },
                { label: "very dissatisfied", value: "very dissatisfied" },

              ]}
              open={open}
              value={satisfied}
              setOpen={setOpen}
              setValue={setSatisfied}
              onChangeValue={setSatisfied}
              placeholder="Select an option"
              placeholderTextColor={"#A1A5C1"}
              style={styles.dropdown}
              textStyle={styles.text}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.listItemLabelStyle}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FText fontSize="medium" fontWeight={700} color={colours.primary} style={styles.label}>
            Which feature do you like the most in the app?
          </FText>
          <TextInput
            style={styles.input}
            placeholder="Enter an answer"
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setFeature}
            value={feature}
          />
        </View>

        <View>
          <FText
            fontSize="medium"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 20, marginLeft: 28 }}
          >
            How often do you use the app?
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "daily", value: "daily" },
                { label: "weekly", value: "weekly" },
                { label: "monthly", value: "monthly" },
                { label: "rarely", value: "rarely" }

              ]}
              open={open2}
              value={usage}
              setOpen={setOpen2}
              setValue={setUsage}
              onChangeValue={setUsage}
              placeholder="Select an option"
              placeholderTextColor={"#A1A5C1"}
              style={styles.dropdown}
              textStyle={styles.text}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.listItemLabelStyle}
            />
          </View>
        </View>

        <View>
          <FText
            fontSize="medium"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            How would you rate app's design?
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "excellent", value: "excellent" },
                { label: "good", value: "good" },
                { label: "average", value: "average" },
                { label: "poor", value: "poor" }

              ]}
              open={open3}
              value={design}
              setOpen={setOpen3}
              setValue={setDesign}
              onChangeValue={setDesign}
              placeholder="Select an option"
              placeholderTextColor={"#A1A5C1"}
              style={styles.dropdown}
              textStyle={styles.text}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.listItemLabelStyle}
            />
          </View>
        </View>

        <View>
          <FText
            fontSize="medium"
            fontWeight={700}
            color={colours.primary}
            style={{ marginBottom: -40, marginTop: 30, marginLeft: 28 }}
          >
            Is the app easy to navigate?
          </FText>

          <View style={styles.dropdownContainer2}>
            <DropDownPicker
              items={[
                { label: "yes", value: "yes" },
                { label: "no", value: "no" },
                { label: "somewhat", value: "somewhat" }

              ]}
              open={open4}
              value={navigation}
              setOpen={setOpen4}
              setValue={setNavigation}
              onChangeValue={setNavigation}
              placeholder="Select an option"
              placeholderTextColor={"#A1A5C1"}
              style={styles.dropdown}
              textStyle={styles.text}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.listItemLabelStyle}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FText fontSize="medium" fontWeight={700} color={colours.primary} style={styles.label}>
            Are there any features you want to add?
          </FText>
          <TextInput
            style={styles.input}
            placeholder="Enter an answer"
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setAddFeature}
            value={addFeature}
          />
        </View>

        <View style={styles.inputContainer}>
          <FText fontSize="medium" fontWeight={700} color={colours.primary} style={styles.label}>
            Please tell us about the issues you have faced?
          </FText>
          <TextInput
            style={styles.input}
            placeholder="Enter an answer"
            placeholderTextColor={"#A1A5C1"}
            onChangeText={setIssues}
            value={issues}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.button}  >
          {loading ? <ActivityIndicator color={"white"} />
            : <FText fontSize="large" fontWeight={700} color={colours.white}>
              Submit
            </FText>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

}

export default Survey;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: colours.secondary
  },
  dropdownContainer2: {
    marginTop: 50,
    paddingHorizontal: 30,


  },
  dropdown: {
    backgroundColor: "#F5F4F8",
    borderColor: colours.primary,
    fontFamily: fonts.LatoRegular,
    borderColor: '#F4F5F8',
    borderWidth: 1,
    zIndex: 1000

  },
  dropdownList: {
    borderColor: "#A1A5C1",

  },
  text: {
    fontFamily: fonts.LatoRegular,
    fontSize: 18,
    color: "#A1A5C1"
  },
  listItemLabelStyle: {
    backgroundColor: '#F4F5F8',
    color: colours.primary,
    fontFamily: fonts.LatoBold

  },

  inputContainer: {
    marginTop: 21,
    marginLeft: 20,
    marginRight: 30,
    marginBottom: 10
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
    height: 150,
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
  },
  inputContainer: {
    marginTop: 21,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10
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
})
