import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Admin from './screens/Admin';
import Signup from './screens/Signup';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import QuizList from './screens/QuizList';
import QuizTaker from './screens/QuizTaker';
import QuizResult from './screens/QuizResult';
import SessionManager from './SessionManager';
import AdminTab from './screens/AdminTab';
import UserTab from './screens/UserTab';
import UpdateQuiz from './screens/UpdateQuiz';
import NetInfo from '@react-native-community/netinfo'
import React,{ useEffect, useState } from 'react';
import 'expo-dev-client';

const Stack = createStackNavigator();

export default function App() {
  const [connected,setConnected]=useState(false);
  const [showStatus, setShowStatus]=useState(false);
useEffect(()=>{
  const unsubscribe=NetInfo.addEventListener((state)=>{
    setConnected(state.isConnected);
    setShowStatus(true);
    setTimeout(()=>setShowStatus(false), 3000);
  })
  return()=>{
    unsubscribe();
  }

},[]);

  return (
    <NavigationContainer>
      {connected ? (
            <View style={[styles.statusContainer, { backgroundColor: 'green' }]}>
            {
                showStatus&&<Text style={styles.statusText}>Online</Text>
            }
            </View>
          ) : (
            <View style={[styles.statusContainer, { backgroundColor: 'red' }]}>
              {
                showStatus&&<Text style={styles.statusText}>Offline</Text>
              }

            </View>
          )}
      <SessionManager>
        <Stack.Navigator>
   
          <Stack.Screen name='login' component={Signup}  options={{ headerShown: false }}/>
          <Stack.Screen  name='Home' component={AdminTab} options={{headerShown:false}}/>
          <Stack.Screen name='Admin' component={Admin}/>
          <Stack.Screen name='User' component={UserTab} options={{headerShown:false}}/>
          <Stack.Screen name='QuizTaker' component={QuizTaker}/>
          <Stack.Screen name='QuizResult' component={QuizResult}/>
          <Stack.Screen name='Update' component={UpdateQuiz}/>

        </Stack.Navigator>
    </SessionManager>
    </NavigationContainer>
    
    

 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    statusContainer: {
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusText: {
      color: 'white',
      fontWeight: 'bold',
    }
});
