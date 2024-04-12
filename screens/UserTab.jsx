import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHome from './UserHome';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import QuizList from './QuizList';
import Location from './Location';

const Tab = createBottomTabNavigator();

const UserTab = () => {
  return (
    <Tab.Navigator
   options={{
    activeTintColor: 'blue',
    inactiveTintColor: 'gray',

   }}
   >
    <Tab.Screen name='home' component={QuizList}
     options={{
        tabBarIcon: () => (
            <Entypo name="home" size={30} color="blue" />
        ),
        headerShown: false,
      }}
    
    />
       <Tab.Screen name='user' component={UserHome}
     options={{
        tabBarIcon: () => (
            <MaterialIcons name="person-pin" size={30} color="blue" />
        ),
        headerShown: false,
      }}
    
    />
    <Tab.Screen name='location' component={Location}
    options={{
      tabBarIcon:()=>(
        <Entypo name="location" size={30} color="blue" />
      ),
      
    }}
    
    />

   </Tab.Navigator>
  )
}

export default UserTab