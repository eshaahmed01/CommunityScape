import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colours }  from '../constants/colours';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack();

  const width = 38;
  const height = 38;
  const top = 53;
  const left = 27;
  const borderRadius = 10;
  const iconWidth = 5;
  const iconHeight = 10;

  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonBase(width, height, top, left, borderRadius)}>
      <Image style={styles.icon(iconWidth, iconHeight)} source={require('../assets/images/chevron-left.png')} />
    </TouchableOpacity>
  );
};

export default React.memo(BackButton);

const styles = StyleSheet.create({
  buttonBase: (width, height, top, left, borderRadius) => ({
    width,
    height,
    position: 'absolute',
    top,
    left,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }),
  icon: (width, height) => ({
    width,
    height,
  }),
});


