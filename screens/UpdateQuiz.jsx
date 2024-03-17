import {ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { collection,addDoc,getFirestore, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UpdateQuiz = ({navigation,route}) => {
    const { quizId } = route.params;
  return (
    <View>
      <Text>UpdateQuiz</Text>
    </View>
  )
}

export default UpdateQuiz

const styles = StyleSheet.create({})