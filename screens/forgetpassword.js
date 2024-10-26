import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, SafeAreaView, StatusBar, StyleSheet, TextInput, Dimensions } from 'react-native';
import CardWrapper from '../components/CardWrapper'; // Update the path accordingly
import COLORS from '../consts/colors';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from "../firebaseconfig"; // Use the imported auth instance
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginIcon from '../assets/img/login.png';
import { sendPasswordResetEmail } from "firebase/auth"




export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Use the auth instance from firebaseconfig
      setMessage('Password reset email sent! Check your inbox.');
      setEmail('');
      setError('');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent backgroundColor="gray" />
      <View style={styles.container}>
        <Image source={LoginIcon} style={styles.icon} />
        <FText color={colours.typography_60} fontSize='h6' style={{ fontWeight: '700', marginTop: 10 }}>Reset Your Password</FText>

        <CardWrapper style={[styles.inputcard, { marginTop: 50, backgroundColor: "white" }]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
          />
        </CardWrapper>

        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        {message ? <Text style={{ color: 'green' }}>{message}</Text> : null}

        <Pressable onPress={handleForgotPassword}>
          <CardWrapper style={styles.cardStyle}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>SEND RESET LINK</Text>
          </CardWrapper>
        </Pressable>

        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "#234F68" }}>Remembered your password? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 70,
    flex: 1,
    backgroundColor: "white",
  },
  icon: {
    // Add styles for the icon if necessary
  },
  input: {
    width: width - 40,
    borderWidth: 0,
    padding: 10,
    backgroundColor: "#F5F4F8",
    borderRadius: 10,
    height: 70,
  },
  inputcard: {
    width: width - 40,
    padding: 1,
    margin: 20,
    marginTop: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4169e1',
  },
  cardStyle: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8BC83F',
    width: 278,
    height: 63,
  },
});
