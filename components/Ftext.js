import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colours } from '../constants/colours';
import { useFonts } from 'expo-font';

export const FontWeights = {
  100: 'Lato-Thin',
  300: 'Lato-Light',
  400: 'Lato-Regular',
  700: 'Lato-Bold',
  900: 'Lato-Black'
  
};

export const FontSizes = {
  normal: 16,
  small: 14,
  medium: 18,
  large: 20,
  h6: 24,
  h5: 28,
  h4: 32,
  h3: 36,
  h2: 40,
  h1: 44,
};

const FText = ({
  children,
  fontWeight = 400,
  fontSize = 'normal',
  color = colours.typography_80,
  lineHeightRatio,
  lineHeight,
  style,
  align = 'left',
  ...restProps
}) => {
  const [fontsLoaded] = useFonts({
    'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
    'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    'Lato-Black': require('../assets/fonts/Lato-Black.ttf'),
  });

  if (!fontsLoaded) {
    return ( <Text> loading... </Text>);
  }
  const size = isNaN(fontSize) ? FontSizes[fontSize] : fontSize;
  const textStyles = {
    fontFamily: FontWeights[fontWeight],
    color,
    fontSize: size,
    ...(lineHeightRatio && { lineHeight: size * lineHeightRatio }),
    ...(lineHeight && { lineHeight }),
    textAlign: align,
  };

  return (
    <Text allowFontScaling={false} style={[styles.base, textStyles, style]} {...restProps}>
      {children}
    </Text>
  );
};

export default FText;

const styles = StyleSheet.create({
  base: {
    color: colours.typography_80,
  },
});
