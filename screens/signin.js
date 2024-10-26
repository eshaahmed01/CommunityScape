import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, SafeAreaView, StatusBar, StyleSheet, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import CardWrapper from '../components/CardWrapper';
import COLORS from '../consts/colors';
import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
import LoginIcon from '../assets/img/login.png';
import FBLogo from '../assets/img/fblogo.png';
import GoogleLogo from '../assets/img/google.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FText from '../components/Ftext';
import { colours } from '../constants/colours';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // useEffect(() => {
  //   const checkUserLoggedIn = async () => {
  //     try {
  //       const user_id = await AsyncStorage.getItem('user_id');
  //       if (user_id) {
  //         navigation.navigate('Category');
  //       } else {
  //         const auth = getAuth();
  //         onAuthStateChanged(auth, (user) => {
  //           if (user) {
  //             AsyncStorage.setItem('user_id', user.uid);
  //             navigation.navigate('Category');
  //           }
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error checking user logged in:', error);
  //     }
  //   };

  //   checkUserLoggedIn();
  // }, [navigation]);

  const handleLogin = async () => {
    const auth = getAuth();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
        setEmail('');
        setPassword('');
        await AsyncStorage.setItem('user_id', user.uid);
        navigation.navigate('Role');
      })
      .catch((error) => {
        console.error('Error signing in:', error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent backgroundColor="gray" />
      <View style={styles.container}>
        <Image source={LoginIcon} style={styles.icon} />
        <FText color={colours.typography_60} fontSize='h6' style={{ fontWeight: '700', marginTop: 10 }}>Let’s Sign In</FText>

        <CardWrapper style={[styles.inputcard, { marginTop: 50, backgroundColor: "white" }]}>
          <TextInput
            style={[styles.input]}
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
          />
        </CardWrapper>

        <CardWrapper style={[styles.inputcard, { marginTop: 0, backgroundColor: "white" }]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </CardWrapper>

        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

        <Pressable onPress={handleLogin} disabled={loading}>
          <CardWrapper style={styles.cardStyle}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>LOGIN</Text>
            )}
          </CardWrapper>
        </Pressable>

        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ color: "#234F68" }}>Don't have an Account?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={{ color: "#234F68", fontWeight: 'bold' }}>Forgot Password?</Text>
        </TouchableOpacity>

        <Pressable>
          <View style={styles.fbBtnView}>
            <Image source={FBLogo} style={{ height: 32, width: 15 }} />
            <Text style={styles.fbTextStyle}>Login with Facebook</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('map')}>
          <View style={styles.googleBtnView}>
            <Image source={GoogleLogo} style={{ height: 32, width: 32 }} />
            <Text style={styles.googleTextStyle}>Login with Google</Text>
          </View>
        </Pressable>
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
  modalText: {
    fontSize: 16,
    color: 'white',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  fbBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 40,
    elevation: 2,
    backgroundColor: '#3b5998',
  },
  fbTextStyle: {
    marginLeft: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  googleBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
    backgroundColor: 'white',
  },
  googleTextStyle: {
    marginLeft: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  }
});