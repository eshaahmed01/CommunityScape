// CardWrapper.js
import React from 'react';
import { Card as OriginalCard } from 'react-native-shadow-cards';

const CardWrapper = ({ children, style = {}, ...props }) => {
  return (
    <OriginalCard style={style} {...props}>
      {children}
    </OriginalCard>
  );
};

export default CardWrapper;