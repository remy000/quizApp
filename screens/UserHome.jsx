import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'

const UserHome = ({navigation}) => {
  const [email, setEmail] = useState('');
 const username = email.split("@")[0];



  useEffect(() => {
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail !== null) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error retrieving email:', error);
      }
    };

    getEmail();
  }, []);
  const logout=()=>{
    signOut(auth);
    navigation.navigate('login');
    AsyncStorage.removeItem('email');
  }
  return (
    <View style={styles.container}>
      <Text>{username}</Text>
      <Text>
        {email}
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
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})