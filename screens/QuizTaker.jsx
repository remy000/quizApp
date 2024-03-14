import React,{useState,useEffect} from 'react'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { collection,addDoc,getFirestore, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNetInfo } from '@react-native-community/netinfo';
import {RadioButton} from 'react-native-paper';

const sqldb = SQLite.openDatabase('quiz.db');

const QuizTaker = ({ route, navigation }) => {
    const { quizId } = route.params;
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const netInfo = useNetInfo();
    

    useEffect(() => {
        fetchQuiz();
        setUpDatabase();
      }, []);

      const fetchQuiz = async () => {
        try {
          const quizRef = doc(db, 'quizzes', quizId);
          const quizSnapshot = await getDoc(quizRef);
          
          if (quizSnapshot.exists()) {
            const quizData = quizSnapshot.data();

            const questionsRef = collection(db, 'quizzes', quizId, 'questions');
            const questionsSnapshot = await getDocs(questionsRef);
            const questionsData = questionsSnapshot.docs.map((doc) => doc.data());
      
            const quizWithQuestions = {
              id: quizId,
              ...quizData,
              questions: questionsData,
            };
           setQuiz(quizWithQuestions);
           setSelectedOptions(Array(quizWithQuestions.questions.length).fill(''));
          } else {
            console.error('Quiz document does not exist');
          }
        } catch (error) {
          console.error('Failed to fetch quiz:', error);
        }
      
      };


      const setUpDatabase=()=>{
        sqldb.transaction((tx) => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS quiz_results (id INTEGER PRIMARY KEY AUTOINCREMENT, quiz_id TEXT, score INTEGER)',
              [],
              () => {
               
              },
              (_, error) => {
                console.error('Failed to create SQLite table:', error);
              }
            );
          });
      }
      const handleOptionSelect = (option) => {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[currentQuestionIndex] = option;
        setSelectedOptions(updatedSelectedOptions);
      }
      
      const handleNextQuestion = () => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < quiz.questions.length) {
          setCurrentQuestionIndex(nextQuestionIndex);
          setSelectedOptions(selectedOptions);
        } else {
          submitQuiz();
        } 
      };
      const calculateScore = () => {
        const totalQuestions = quiz.questions.length;
        let correctAnswers = 0;
      
        for (let i = 0; i < quiz.questions.length; i++) {
            if (quiz.questions[i].correctOption === selectedOptions[i]) {
              correctAnswers++;
            }
          }
      
        const score = (correctAnswers / totalQuestions) * 100;
        return score;
      };
      const submitQuiz = async () => {
        try {
          const score = calculateScore();
          if (netInfo.isConnected) {
            await storeQuizResultInFirebase(quizId, score);
          } else {
            saveQuizResultInSQLite(quizId, score);
          }
          navigation.navigate('QuizResult', { score });
        } catch (error) {
          alert('Failed to submit quiz:', error);
        }
      };
     
      const storeQuizResultInFirebase = async (quizId, score) => {
        try {
          const quizResultRef = collection(db, 'quiz_results');
          await addDoc(quizResultRef, { quizId, score });
          console.log('Quiz result stored in Firebase');
        } catch (error) {
          console.error('Failed to store quiz result in Firebase:', error);
        }
      };
    
      const saveQuizResultInSQLite = (quizId, score) => {
        sqldb.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO quiz_results (quiz_id, score) VALUES (?, ?)',
            [quizId, score],
            (_, { insertId }) => {
              console.log('Quiz result saved in SQLite with ID:', insertId);
            },
            (_, error) => {
              console.error('Failed to save quiz result in SQLite:', error);
            }
          );
        });
      };
      if (!quiz) {
        return (
            <View style={styles.loading}>
            <ActivityIndicator color="blue" size="large"/>
            <Text style={styles.loadingText}>Loading Questions...</Text>
            </View>
        );
      }
    
    
      const currentQuestion = quiz.questions[currentQuestionIndex];

      return (
        <View style={styles.container}>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                <RadioButton.Android
                    value={option}
                    status={selectedOptions[currentQuestionIndex] === option ? 'checked' : 'unchecked'}
                    onPress={() => handleOptionSelect(option)}
                />
                <Text style={styles.optionText}>{option}</Text>

                </View>
            ))}
          <Button
            title={currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            onPress={handleNextQuestion}
            disabled={selectedOptions === ''}
            color={currentQuestionIndex === quiz.questions.length-1 ? 'green':'blue'}
          />
        </View>
      );
    };
    
    export default QuizTaker;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
      question: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom:25,
        marginTop:25
      },
      loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        width: 500,
        marginTop: 200,
      },
      loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
      },
      optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
      },
      optionText: {
        marginLeft: 8,
        fontSize:15
      },
    });