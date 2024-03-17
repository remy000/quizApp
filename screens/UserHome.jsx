import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const UserHome = ({navigation}) => {
  const emails=sessionStorage.getItem('email');
  const logout=()=>{
    signOut(auth);
    navigation.navigate('login');
  }
  return (
    <View>
      <Text>
        {emails}
      </Text>
      <TouchableOpacity onPress={logout} style={{backgroundColor:'blue', marginTop:'5'}}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UserHome

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flex:'1',
    justifyContent:'center',
    alignItems:'center'
  }
})