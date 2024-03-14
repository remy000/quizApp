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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SessionManager>
        <Stack.Navigator>
   
          <Stack.Screen name='login' component={Signup}  options={{ headerShown: false }}/>
          <Stack.Screen  name='Home' component={AdminTab} options={{headerShown:false}}/>
          <Stack.Screen name='Admin' component={Admin}/>
          <Stack.Screen name='User' component={UserTab} options={{headerShown:false}}/>
          <Stack.Screen name='QuizTaker' component={QuizTaker}/>
          <Stack.Screen name='QuizResult' component={QuizResult}/>

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
});
