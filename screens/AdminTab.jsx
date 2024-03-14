import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHome from './UserHome';
import AdminHome from './AdminHome';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AdminTab = () => {
  return (
   <Tab.Navigator
   options={{
    activeTintColor: '#00563B',
    inactiveTintColor: 'gray',

   }}
   >
    <Tab.Screen name='home' component={AdminHome}
     options={{
        tabBarIcon: () => (
            <Entypo name="home" size={30} color="#00563B" />
        ),
        headerShown: false,
      }}
    
    />
       <Tab.Screen name='user' component={UserHome}
     options={{
        tabBarIcon: () => (
            <MaterialIcons name="person-pin" size={30} color="#00563B" />
        ),
        headerShown: false,
      }}
    
    />

   </Tab.Navigator>
  )
}

export default AdminTab
