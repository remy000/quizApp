import {ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection,getFirestore, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UpdateQuiz = ({ navigation, route }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetchQuiz();
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
       
      } else {
        console.error('Quiz document does not exist');
      }
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    }
  };

  const handleQuizTitleChange = (newTitle) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      title: newTitle,
    }));
  };

  const handleQuestionTextChange = (newText, questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].question = newText;
      return {
        ...prevQuiz,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionTextChange = (newText, questionIndex, optionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].options[optionIndex] = newText;
      return {
        ...prevQuiz,
        questions: updatedQuestions,
      };
    });
  };

  const handleCorrectOptionChange = (newText, questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].correctOption = newText;
      return {
        ...prevQuiz,
        questions: updatedQuestions,
      };
    });
  };

  const handleUpdateQuiz = async () => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      await updateDoc(quizRef, { title: quiz.title });

      const questionsRef = collection(db, 'quizzes', quizId, 'questions');
      quiz.questions.forEach(async (question, index) => {
        const questionRef = doc(questionsRef, `${index}`);
        await updateDoc(questionRef, { question: question.question, options: question.options, correctOption: question.correctOption });
      });

      console.log('Quiz updated successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Title</Text>
      <ScrollView>
        {quiz ? (
          <>
            <TextInput
              value={quiz.title}
              onChangeText={handleQuizTitleChange}
              style={styles.input}
            />
            <Text style={styles.questionTitle}>Questions:</Text>
            {quiz.questions.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.question}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10 }}>
                  {questionIndex + 1}.
                </Text>
                <Text style={styles.headers}>Question</Text>
                <TextInput
                  value={question.question}
                  onChangeText={(newText) => handleQuestionTextChange(newText, questionIndex)}
                  style={styles.input}
                  multiline
                />
                <Text style={styles.headers}>Options</Text>
                {question.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.ask}>
                    <TextInput
                      value={option}
                      onChangeText={(newText) => handleOptionTextChange(newText, questionIndex, optionIndex)}
                      style={styles.input}
                      multiline
                    />
                  </View>
                ))}

                <View style={styles.correct}>
                  <Text style={styles.headers}>Correct Option</Text>
                 <TextInput
                    value={question.correctOption}
                    onChangeText={(newText) => handleCorrectOptionChange(newText, questionIndex)}
                    style={styles.input}
                    multiline
                  />
                </View>
              </View>
            ))}
            <View style={styles.buttons}>
              <Button title="Update" onPress={handleUpdateQuiz} />
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" color="blue" />
        )}
      </ScrollView>
    </View>
  );
};

export default UpdateQuiz;


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
    },
    correct:{
        display:'flex',
        flex:1,
        justifyContent:'center',
        marginTop:10,
         marginBottom:10

    },
     headers:{
        fontWeight:'500',
        marginBottom:5
     }
})