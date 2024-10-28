import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const NotificationBellIcon = ({ size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.742 14.386c.017-.143.258-3.386-1.702-5.715-.21-.3-.481-.581-.803-.852-1.748-1.563-4.294-2.858-7.237-2.858-2.944 0-5.49 1.294-7.238 2.858a6.853 6.853 0 0 0-.803.852c-1.96 2.329-1.719 5.572-1.702 5.715a1 1 0 0 0 .706.986l1.609.516a4.005 4.005 0 0 0 1.061 2.221c.429.46.955.81 1.514 1.022.55.211 1.129.279 1.702.205 1.982-.204 3.945-.307 5.889-.307 1.944 0 3.907.103 5.889.307.573.074 1.152.006 1.702-.205.559-.212 1.085-.562 1.514-1.022.428-.459.766-1.033 1.016-1.683.29-1.009.485-2.019.586-3.028.056-.541-.372-1.002-.909-1.064l1.677-.534a1 1 0 0 0 .692-1.107v0z"/>
    <Path d="M12 22C14.985 22 17.463 20.293 18.37 17.5H5.63C6.537 20.293 9.015 22 12 22z"/>
  </Svg>
);

export default NotificationBellIcon;