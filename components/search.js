import IconA from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/Feather';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FText from './Ftext';
import { colours } from '../constants/colours';


const SearchBar = () => {

    const text = <FText color={colours.typography_80} fontSize="small"  >  Search house, apartment etc </FText>

   

    return (
      <View style={styles.container}>
        <IconA name="search1" size={20} color="#B0B0B0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="search house, apartment etc"
          placeholderTextColor="#B0B0B0"
        />
        
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E8E8E8',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: 20,
      width: '80%',
      marginLeft: 30
    },
    icon: {
      marginHorizontal: 5,
    },
    input: {
      flex: 1,
      height: 40,
      fontSize: 16,
      color: '#000',
    },
  });
  
  export default SearchBar;