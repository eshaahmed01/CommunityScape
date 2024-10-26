import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import bg from '../assets/img/Rectangle-227.png'; 
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={bg}
        style={styles.imageBackground} 
      >
        <Text style={styles.title}>Let's find your dream house!</Text>
        {/* <Text style={styles.subtitle}>Lorem ipsum dolor sit amet, consectetur adipis</Text> */}
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('SignScreen')}>
          <Text style={styles.nextButtonText }>➔</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },
  nextButton: {
    marginTop: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 24,
    color: '#333',
  },
});

export default SplashScreen;
