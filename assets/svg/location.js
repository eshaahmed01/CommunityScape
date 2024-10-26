import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colours } from '../../constants/colours';

const LocationIcon = ({ size = 25, color = colours.typography_60}) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <Path
      d="M12 2C8.134 2 5 5.134 5 9c0 3.107 1.535 6.157 4.033 8.044l.706.571c.28.226.649.341 1.017.341s.737-.115 1.017-.341l.706-.571C17.465 15.157 19 12.107 19 9c0-3.866-3.134-7-7-7zm0 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"
      fill={color}
    />
  </Svg>
);

export default LocationIcon;
