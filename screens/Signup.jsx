import { ActivityIndicator, Alert, Button,TouchableWithoutFeedback, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import * as yup from 'yup'
const Signup = ({navigation}) => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [loading,setLoading]=useState(false);
    const [errors, setErrors] = useState({});
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const validationSchema = yup.object().shape({
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().required('Password is required'),
    });
    const validateField = async (fieldName, value) => {
      try {
        await validationSchema.validateAt(fieldName, { [fieldName]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error.message }));
      }
    };

    const handleRegister=async()=>{
      setLoading(true);
        try {
            const response=await createUserWithEmailAndPassword(auth,email,password);
            alert("user saved");
            setLoading(false);
            setEmail(''),
            setPassword('')
            
        } catch (error) {
            alert(error);
            setEmail(''),
            setPassword('')
            setLoading(false);
            
        }
    }

    const handleLogin=async()=>{
      setLoading(true);
      try {
        const userCredential=await signInWithEmailAndPassword(auth,email,password);
        const user=userCredential.user;
        if(user){
          setLoading(false)
        if(user.email==='admin@gmail.com'){
          setEmail(''),
          setPassword('')
          sessionStorage.setItem('email', user.email);
         navigation.navigate('Home');
        }
        else{
          alert("you login as user");
          setEmail('');
          setPassword('');
          sessionStorage.setItem('email', user.email);
          navigation.navigate('User');
        }
      }
        
      } catch (error) {
        setEmail(''),
        setPassword('')
        setLoading(false);
        Alert.alert(error.message);
        
      }
    }

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.header}>
      <MaterialIcons name="quiz" size={45} color="blue" />
      <Text style={styles.text}>Quiz App</Text>
      </View>
      <Text style={styles.headerText}>Let's Sign you In.</Text>
     
      <View style={styles.form}>
      <Text style={styles.label}>Email Address</Text>
      {isEmailFocused && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
      value={email}
      onChangeText={(text)=>setEmail(text)}
      onBlur={() => {
        setIsEmailFocused(false);
      }}
      onKeyPress={()=>{
        setIsEmailFocused(true)
        validateField('email', email);
        
      }}
      placeholder='Enter Email'
      style={styles.input}
      />
     
      <Text style={styles.label}>Password</Text>
      <TextInput
      value={password}
      onChangeText={(text)=>setPassword(text)}
      placeholder='Enter Password'
      secureTextEntry
      style={styles.input}
      />
      
      {
        loading? (<ActivityIndicator size="large" color="blue"/>):
        (
          <>
           
            <View style={styles.button}>
            <Button title='login' onPress={handleLogin} style={styles.login} color="blue"/>
            </View>
          
            <TouchableOpacity onPress={handleRegister} style={styles.opacity}>
              <Text style={styles.opacityText}>Create Account</Text>

            </TouchableOpacity>
            
          </>
        )
      }
    
 
      </View>
  

    </View>
    </TouchableWithoutFeedback>
  )
}

export default Signup

const styles = StyleSheet.create({
  container:{
    flex:1,
    display:'flex',
    backgroundColor:'white',
    alignSelf:'center',
    paddingRight:20,
    marginLeft:10
   
  },
  header:{
    display:'flex',
    flexDirection:'row',
    marginTop:150,
    alignItems:'center',
    justifyContent:"center"
  }
  ,
  text:{
    fontSize:45,
    fontWeight:'bold',
    color:'blue',
    textAlign:'center',
    marginLeft:20
  },
  headerText:{
    fontSize:25,
    textAlign:'left',
    marginTop:65,
    fontWeight:'bold',
    marginLeft:35,
    marginBottom:2


  },
  form:{
    marginVertical:5,
    height:'50%',
    width:"80%",
    display:'flex',
    padding:35,
  },
  input:{
    paddingVertical:10,
    borderColor:'gray',
    backgroundColor:'white',
    width:300,
    height:50,
    borderRadius:40,
    paddingHorizontal:25,
    borderWidth:0.4,
    marginBottom:16
  },
  login:{
    padding:10,
    backgroundColor:'green',
    borderRadius:20

  },
  button:{
    marginVertical:10,
    },
  opacity:{

    display:'flex',
    justifyContent:'center',
    marginVertical:4
  }
,
opacityText:{
  textAlign:'center',
  color:'blue',
  fontWeight:'500',
  fontSize:18
},
label:{
  paddingBottom:10,
  color:'gray',
  fontWeight:"800",
  marginLeft:5

},
errorText: {
  color: 'red',
  fontSize: 12,
  marginLeft:15,
  marginBottom:3
},
})