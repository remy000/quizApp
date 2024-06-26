import React,{useState,useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import { auth } from './firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AppState} from 'react-native'

const SessionManager = ({children}) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const SESSION_TIMEOUT_DURATION = 60 * 60 * 1000;
  let backgroundTimer = null;

  useEffect(() => {
    const checkSessionTimeout = async () => {
      try {
        const sessionStart = await AsyncStorage.getItem('sessionStart');
        const currentTime = Date.now();
        const appState = AppState.currentState;

        if (sessionStart && appState === 'active') {
          const elapsed = currentTime - parseInt(sessionStart, 10);
          if (elapsed > SESSION_TIMEOUT_DURATION) {
            signOut(auth);
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('sessionStart');
            alert('Your session has timed out. Please log in again.');
            navigation.navigate('login');
          }
        } else {
          AsyncStorage.setItem('sessionStart', currentTime.toString());
        }
      } catch (error) {
        console.error('Error checking session timeout:', error);
      }
    };

    const resetSessionTimeout = async () => {
      try {
        await AsyncStorage.setItem('sessionStart', Date.now().toString());
      } catch (error) {
        console.error('Error setting session start time:', error);
      }
    };

    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'background') {
        backgroundTimer = setTimeout(() => {
          resetSessionTimeout();
        }, SESSION_TIMEOUT_DURATION);
      } else if (nextAppState === 'active') {
        clearTimeout(backgroundTimer);
      }
    };

    const sessionTimeout = setInterval(checkSessionTimeout, SESSION_TIMEOUT_DURATION);
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(sessionTimeout);
      AppState.removeEventListener('change', handleAppStateChange);
      clearTimeout(backgroundTimer); // Clear the background timer on unmount
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        AsyncStorage.setItem('authToken', currentUser.uid);
      } else {
        setUser(null);
        AsyncStorage.removeItem('authToken');
        AsyncStorage.removeItem('sessionStart');
      }
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
};


export default SessionManager
