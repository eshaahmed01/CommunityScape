import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Pressable} from 'react-native';
import img1 from '../assets/img/Rectangle-10.png'; // Ensure this path is correct
import img2 from '../assets/img/Rectangle-9.png'; // Ensure this path is correct
import img3 from '../assets/img/Rectangle-11.png'; // Ensure this path is correct
import img4 from '../assets/img/Rectangle8.png'; // Ensure this path is correct
import FBLogo from '../assets/img/fblogo.png';
import GoogleLogo from '../assets/img/google.png';
import { useNavigation } from '@react-navigation/native';
import FText from '../components/Ftext';

const Sign = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.gallery}>
        <View> 
        <Image source={img1} style={styles.galleryImage} /> 
        <Image source={img2} style={styles.galleryImage} /> 
        </View>
        <View> 
        <Image source={img3} style={styles.galleryImage} /> 
        <Image source={img4} style={styles.galleryImage} /> 
        </View>
      </View>
      <Text style={styles.exploreText}>Ready to explore?</Text>


      <TouchableOpacity style={styles.emailButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.emailButtonText}>Continue with Email</Text>
      </TouchableOpacity>
      <View style={styles.socialButtonsContainer}>

      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <Pressable>
          <View style={styles.fbBtnView}>
            <Image source={FBLogo} style={{ height: 32, width: 15 }} />
            <Text style={styles.fbTextStyle}>Login with Facebook</Text>
          </View>
        </Pressable>

         <Pressable>
          <View style={styles.googleBtnView}>
            <Image source={GoogleLogo} style={{ height: 32, width: 32 }} />
            <Text style={styles.googleTextStyle}>Login with Google</Text>
          </View>
        </Pressable> 

      
    </View>
    
    

  );
};

const styles = StyleSheet.create({
  container: {
   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  gallery: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 50,
    width: '30%', // Adjust as needed to fit the design
  },
galleryImage: {
    width: 170,
    height: 174, // Fixed height for the images
    margin: '3%', // Adjust the margin to fit your design
    backgroundColor: '#EEE',
    borderRadius: 20, // Add border radius to images
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
    paddingHorizontal: 70,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
    backgroundColor: 'white',
  },
  fbBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: '#3b5998',
  },
  exploreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  emailButton: {
    width: '80%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#8BC83F',
    alignItems: 'center',
    marginVertical: 10,
  },
  emailButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 10,
  },
  socialButton: {
    width: '45%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  registerText: {
    color: '#888',
    marginTop: 0,
  },
});

export default Sign;
