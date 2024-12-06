import { StyleSheet, TouchableOpacity, View, Image, StatusBar, } from 'react-native'
import React from 'react'
import { colours } from '../constants/colours'
import FText from './Ftext'
import useUserManager from '../hooks/useUserManager'

const ViewUserPost = () => { 

    const { currentUser } = useUserManager();

  return (
    <View style={styles.card}>
      <View style={{flex:1}}>
        <View style={styles.profileContainer}>
            <View style={{flexDirection:'row', alignItems:'center'}}>

              <Image resizeMode='cover' style={styles.profileImg} source={{uri: currentUser?.profilePic }}/>

                <View style={{paddingLeft:10}}>
                    <FText style={{color: 'black'}}>{currentUser?.fullName}</FText>
                    <FText style={{fontSize:12}}>{currentUser?.email}</FText>
                </View>
            </View>          
        </View>
        <TouchableOpacity>
          <FText style={{paddingLeft:'6%',fontSize:12, paddingTop:'3%'}}>Type Something to Start Discussion...</FText>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.postBtn}>
            <FText style={{fontSize:14, color: 'white'}}>Post</FText>
        </TouchableOpacity>
      </View>  
    </View>
  )
}

export default ViewUserPost

const styles = StyleSheet.create({
    card:{
        height:205, 
        width:'100%',
        backgroundColor: colours.lighter_border,
        marginTop : StatusBar.currentHeight
    },
    profileImg:{height:54,width:54,borderRadius:27,},
    profileContainer:{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:'5%', paddingTop:'5%'},
    publicBtn:{
        flexDirection:'row',
        alignItems:'center', 
        paddingHorizontal:10, 
        paddingVertical:8, 
        borderWidth:1, 
        borderColor:colours.primary, 
        borderRadius:60, 
        width:'25%', 
        justifyContent:'space-between',
    },
    iconsContainer:{
        flexDirection:'row',
        justifyContent:'flex-end',
        borderTopWidth:1,
        borderColor:'#E7E7E7',
        paddingVertical:'3%',
        alignItems:'center',
        paddingHorizontal:16
    },
    postBtn:{
        flexDirection:'row', 
        backgroundColor:colours.primary, 
        alignItems:'center', 
        paddingHorizontal:20, 
        paddingVertical:9, 
        borderRadius:60, 
        justifyContent:'space-between', 
    },
    input:{ 
        marginVertical:'5%', 
        fontSize:16, 
        color:'black',
        minHeight:'40%',
    },
    postImg:{height:147, width:'100%',marginTop:'4%', borderRadius:4,},
})