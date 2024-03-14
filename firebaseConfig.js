// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,initializeAuth,getReactNativePersistence} from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCQqFBb6dhqQme7Bf7Ik0DNZ4ePJYRAYh0",
  authDomain: "quizapp-f7c3b.firebaseapp.com",
  projectId: "quizapp-f7c3b",
  storageBucket: "quizapp-f7c3b.appspot.com",
  messagingSenderId: "1036868490044",
  appId: "1:1036868490044:web:a758c45d5493b1de0e0439"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
export const auth=initializeAuth(app,{
  persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db=getFirestore(app);