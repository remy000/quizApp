import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Entypo,FontAwesome,MaterialIcons } from '@expo/vector-icons';

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
      <View style={styles.home}>
      <FontAwesome name="user-circle" size={50} color="blue" />
      <Text style={styles.homeText}>User Account</Text>
      </View>
      <View style={styles.content}>
      <View style={styles.names}>
      <FontAwesome name="user" size={27} color="black" />
      <Text style={styles.texts}>   {username}
      </Text>
      </View>

      <View style={styles.emails}>
      <Entypo name="mail" size={27} color="black" />
      <Text style={styles.texts}>
          {email}
      </Text>
      </View>

      <View style={styles.roles}>
      <MaterialIcons name="work" size={27} color="black" />
      <Text style={styles.texts}>  {username&& username.startsWith("admin")?'Admin':'Student'}</Text>

      </View>
      </View>
      
      
      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UserHome

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flex:1,
    alignItems:'flex-start',
    marginTop:130,
    flexDirection:'column',
    gap:20,
    marginLeft:2
  }, 
  home:{
    display:'flex',
    flexDirection:'column',
    gap:4,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center', 
    marginBottom:50
  },
   homeText:{
    fontSize:30,
    fontWeight:'bold',
    color:'blue'
   },
   content:{
    display:'flex',
    flexDirection:"column",
    gap:40,
    borderColor:"blue",
    borderWidth:0.5,
    alignSelf:'center',
    paddingVertical:25,
    paddingHorizontal:15

   },
   names:{
    display:"flex",
    flexDirection:'row',
    gap:8,

   },
   emails:{
    display:"flex",
    flexDirection:'row',
    gap:8,

   }, 
   roles:{
    display:"flex",
    flexDirection:'row',
    gap:8,
   },
  texts:{
    fontSize:20,
    fontWeight:'700'
  }, 
  button:{
    alignSelf:'center',
    marginTop:30,
    backgroundColor:'blue',
    borderRadius:40,
    textAlign:'center',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  btnText:{
    color:'white',
    padding:15,
    fontSize:18
  }
})