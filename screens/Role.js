
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { colours } from '../constants/colours'
import FText from '../components/Ftext'
import BackButton from '../components/BackButtons'
import Icon from 'react-native-vector-icons/FontAwesome6'
import React, { useState, useEffect } from 'react'

const Role = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { name: 'Buyer', icon: 'user' },
    { name: 'Seller', icon: 'store' },
    { name: 'Investor', icon: 'chart-line' },
  ];

 
  const handleRolePress = (role) => {
    setSelectedRole(role); // Set the selected role
  };

  const handleContinue =()=> {
    if(selectedRole=="Seller"){
      navigation.navigate('SellerTab')
    }
    if(selectedRole=="Buyer"){
      navigation.navigate('HomeTab')
    }

    if(selectedRole=="Investor"){
      navigation.navigate('Investor')
    }
    setSelectedRole(null);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentWrapper}>
        <FText fontSize='h5' fontWeight='600' color={colours.typography_60} style={styles.subtitle}>
          Please select your role
        </FText>
        <Text style={styles.description}>
          Select one of the roles to proceed further in the app. You can always change it later.
        </Text>
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.name}
              style={[
                styles.roleCard,
                selectedRole === role.name && styles.selectedRoleCard,
              ]}
              onPress={() => handleRolePress(role.name)}
            >
              <Icon
                name={role.icon}
                size={36}
                color={selectedRole === role.name ? colours.white : colours.primary}
                style={styles.roleIcon}
              />
              <Text
                style={[
                  styles.roleText,
                  selectedRole === role.name && styles.selectedRoleText,
                ]}
              >
                {role.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedRole ? { backgroundColor: colours.success } : { backgroundColor: colours.grey_suit },
        ]}
        // onPress={() => selectedRole && navigation.navigate('SellerTab')}
        onPress={()=> handleContinue()}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.app_background,
    justifyContent: 'center',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexGrow: 1, // This will ensure the content takes up available space and stays centered
  },
  subtitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  description: {
    marginBottom: 30,
    textAlign: 'center',
    color: colours.typography_40,
    fontSize: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleCard: {
    width: '30%',
    backgroundColor: colours.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colours.primary,
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRoleCard: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  roleIcon: {
    marginBottom: 10,
  },
  roleText: {
    fontSize: 16,
    color: colours.primary,
  },
  selectedRoleText: {
    color: colours.white,
  },
  continueButton: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: colours.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Role;