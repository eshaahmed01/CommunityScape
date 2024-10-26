import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { colours } from '../constants/colours';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Entypo'
import Icon5 from 'react-native-vector-icons/FontAwesome'



// Define the icon components
const HomeIcon = (props) => <Icon4 name="home" size={30} color={props.color} />;
const SearchIcon = (props) => <Icon2 name="search" size={30} color={props.color} />;
const CameraIcon = (props) => <Icon3 name="cameraswitch" size={30} color={props.color} />;
const ProfileIcon = (props) => <Icon5 name="user" size={30} color={props.color} />;

const tabBarData = [
  {
    name: 'Home',
    icon: HomeIcon,
    routeName: 'Home',
  },
  {
    name: 'Search',
    icon: SearchIcon,
    routeName: 'Search'
  },
  {
    name: 'LandDetail',
    icon: CameraIcon,
    routeName: 'LandDetail',
  },
  {
    name: 'Profile',
    icon: ProfileIcon,
    routeName: 'Profile',
  },
];

const BottomTabBar = ({ navigation, state }) => {
  const renderTabBarItem = (item, index) => {
    const isActive = state.index === index;
    const onPress = () => navigation.navigate(item.routeName);
    const IconComponent = item.icon;

    return (
      <Pressable key={item.name} onPress={onPress} style={styles.tabItem}>
      <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
        <IconComponent color={isActive ? colours.typography_60 : colours.typography_40} />
      </View>
    </Pressable>
    );
  };

  return (
    <View style={styles.bottomTabBar}>{tabBarData.map(renderTabBarItem)}</View>
  );
};

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 74, // Replace with the desired value
    backgroundColor: colours.white,
    borderTopColor: colours.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeLine: {
    width: 40, 
    height: 3, 
    backgroundColor: colours.typography_60,
    position: 'absolute',
    top: 0,
    borderBottomRightRadius: 3, 
    borderBottomLeftRadius: 3, 
  },
  cartBadge: {
    position: 'absolute',
    top: 10, 
    right: 30, 
    padding: 2, 
    paddingHorizontal: 4, 
    borderRadius: 99,
    backgroundColor: colours.primary,
    borderColor: colours.white,
    borderWidth: 2, // Replace with the desired value
  },
  cartBadgeInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colours.white,
    fontSize: 10, // Replace with the desired value
  },
});

export default BottomTabBar;
