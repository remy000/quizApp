import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import { collection, addDoc,getDocs, getDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import {useNetInfo} from '@react-native-community/netinfo';
import {Picker} from '@react-native-picker/picker'
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'

const sqldb = SQLite.openDatabase('quiz.db');


const Admin = ({navigation}) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctOption: ''}]);
    const [newQuestion, setNewQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState('');
    const netInfo = useNetInfo();
   
    useEffect(() => {
      setUpDatabase();
       if(netInfo.isConnected){
        syncOfflineQuizzes();
      }
    }, [netInfo.isConnected]);



    const addQuestion = () => {
            const updatedQuestions = [...questions, { question: newQuestion, options: options, correctOption: correctOption }];
            setQuestions(updatedQuestions);
            setNewQuestion('');
            setOptions(['', '', '', '']);
            setCorrectOption('');
    };


    const saveQuizOnline = async (quiz) => {
            try {
              const quizRef = collection(db, "quizzes");
              const docRef = await addDoc(quizRef, { title: quiz.title });
          
              for (const question of quiz.questions) {
                await addDoc(collection(docRef, "questions"), {
                  question: question.question,
                  options: question.options,
                  correctOption: question.correctOption
                });
              }
              await AsyncStorage.setItem("newQuizSaved","true");
              alert("Quiz saved successfully in firebase");
            } catch (error) {
              console.error("Failed to save quiz online:", error);
            }
    };


    const setUpDatabase = () => {
            sqldb.transaction(tx => {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS quizzes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)'
              );
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, quiz_id INTEGER, question TEXT, options TEXT, correct_option TEXT)'
              );
            });
    };

    const saveQuizOffline = async (quiz) => {
            try {
              sqldb.transaction(tx => {
                tx.executeSql(
                  'INSERT INTO quizzes (title) VALUES (?)',
                  [quiz.title],
                  (_, { insertId }) => {
                    for (const question of quiz.questions) {
                      tx.executeSql(
                        'INSERT INTO questions (quiz_id, question, options, correct_option) VALUES (?, ?, ?, ?)',
                        [insertId, question.question, JSON.stringify(question.options), question.correctOption],
                        (_, { insertId: questionInsertId }) => {
                          ('Question saved successfully with ID:', questionInsertId);
                        },
                        (_, error) => {
                          console.error('Failed to save question:', error);
                         
                        }
                      );
                    }
                    alert('Quiz saved successfully in SQLite');
                  },
                  (_, error) => {
                    console.error('Failed to save quiz:', error);
                  }
                );
              });
            } catch (error) {
              console.error('Failed to save quiz offline:', error);
            }
          };

      const syncOfflineQuizzes = async () => {
            try {
              const quizzesQueryResult = await new Promise((resolve, reject) => {
                sqldb.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM quizzes',
                    [],
                    (_, { rows }) => resolve(rows),
                    (_, error) => reject(error)
                  );
                });
              });
          
              const offlineQuizzes = quizzesQueryResult._array;
              for (const quiz of offlineQuizzes) {
                const quizzesRef = collection(db, 'quizzes');
                const querySnapshot = await getDocs(quizzesRef);
                const existingQuiz = querySnapshot.docs.find(doc => doc.data().title === quiz.title);
          
                if (!existingQuiz) {
                  console.log("quiz not found");
                  const questionsQueryResult = await new Promise((resolve, reject) => {
                    sqldb.transaction(tx => {
                      tx.executeSql(
                        'SELECT * FROM questions WHERE quiz_id = ?',
                        [quiz.id],
                        (_, { rows }) => resolve(rows),
                        (_, error) => reject(error)
                      );
                    });
                  });
          
                  const offlineQuestions = questionsQueryResult._array;
                  const syncedQuiz = {
                    title: quiz.title,
                    questions: offlineQuestions.map(question => ({
                      question: question.question,
                      options: JSON.parse(question.options),
                      correctOption: question.correct_option
                    }))
                  };
                  
                  await saveQuizOnline(syncedQuiz);
                }
              }
            } catch (error) {
              console.error('Failed to sync offline quizzes:', error);
            }
          };

  const handleSubmit=async()=>{
    try {
        if (quizTitle.trim() === '') {
          alert('Please enter quiz title');
          return;
        }
  
        if (questions.length === 0 || questions.some(q => q.question.trim() === '' || q.options.some(o => o.trim() === '') || q.correctOption === '')) {
            alert('Please fill out all questions and options');
            return;
          }
          if(netInfo.isConnected){
          await saveQuizOnline({ title: quizTitle, questions });
          }
          else{
            await saveQuizOffline({title:quizTitle,questions});
          }
        setQuizTitle('');
        setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
      } catch (error) {
        console.error(error);
        alert('Failed to save quiz');
      }
    };
  

  

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Quiz Title</Text>
        <TextInput value={quizTitle} onChangeText={setQuizTitle} placeholder="Enter quiz title"  style={styles.input}/>
        <ScrollView>
        <Text style={styles.questionTitle}>Questions:</Text>
        {questions.map((question, index) => (
            <View key={index} style={styles.question}>
              <Text style={{fontWeight:'bold', fontSize:15, marginLeft:10}}>{index+1}.</Text>
                <TextInput
                  value={question.question}
                  onChangeText={(text) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].question = text;
                      setQuestions(updatedQuestions);
                  }}
                  placeholder="Enter Question"
                  style={styles.input}
                  multiline
                />

              {question.options.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.ask}>
                  <TextInput
                  value={option}
                    onChangeText={(text) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].options[optionIndex] = text;
                      setQuestions(updatedQuestions);
                  }}
                  placeholder={`Enter Answer option ${optionIndex + 1}`}
                  style={styles.input}
                  multiline
                  />
              </View>
              ))}

              {correctOption !== '' ? (
              <Text>Correct Answer: {correctOption}</Text>
                ) : (
                  <>
                  <Text style={{fontWeight:'bold', fontSize:15, marginLeft:10}}>correct answer.</Text>
              <Picker
                  selectedValue={question.correctOption}
                  onValueChange={(value) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].correctOption = value;
                    setQuestions(updatedQuestions);
                  }}
                  style={styles.picker}
                >
                  
                  <Picker.Item label="Select correct answer" value=""/>
                  {question.options.map((option, optionIndex) => (
                    <Picker.Item key={optionIndex} label={option} value={option} />
                  ))}
              </Picker>
              </>
            )}
          </View>
      ))}
      <View style={styles.buttons}> 
        <Button title="Add Question" onPress={addQuestion} />
        <Button title="Submit Quiz" onPress={handleSubmit} color='green' />
      </View>
      
     

      
      </ScrollView>

       
    </View>
 
  )
}

export default Admin

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        marginLeft:15,
        marginBottom:10,
        justifyContent:'center',
        width:'100%',
    
        
    },
    input:{
      paddingVertical:8,
      borderColor:'gray',
      backgroundColor:'white',
      width:350,
      height:32,
      borderRadius:40,
      paddingHorizontal:25,
      borderWidth:0.4,
      marginBottom:10
    },
    picker:{
      paddingVertical:2,
      borderColor:'gray',
      backgroundColor:'white',
      width:250,
      paddingHorizontal:10,
      marginBottom:20,
      alignSelf:'center'

    },
    question:{
      display:'flex',
      flex:1,
      flexDirection:'column',
      height:300,
    },
    title:{
      textAlign:'center',
      fontSize:20,
      fontWeight:'bold',
      marginBottom:2,
      marginTop:10
    },
    questionTitle:{
      fontSize:20,
      fontWeight:'bold',
      marginBottom:2
    },
    buttons:{
      marginTop:20,
      marginBottom:10,
      alignSelf:'center',
       display:'flex',
       flexDirection:'row',
       gap:4
    },
    ask:{
      display:'flex',
      flex:1,
      justifyContent:'center',
    }
})