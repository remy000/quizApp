import React,{useState,useEffect} from 'react'
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';
import { collection,getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const QuizList = ({navigation}) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
      fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
          const quizzesRef = collection(db, 'quizzes');
          const quizzesSnapshot = await getDocs(quizzesRef);
          const quizzesData = quizzesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQuizzes(quizzesData);
          setLoading(false)
        } catch (error) {
          console.error('Failed to fetch quizzes:', error);
          setLoading(false)
        }
      };

      const handleQuizSelect = (quizId) => {
        navigation.navigate('QuizTaker', { quizId });
      };
    
      const renderQuizItem = ({ item }) => (
        <TouchableOpacity style={styles.quizItem} onPress={() => handleQuizSelect(item.id)}>
          <Text style={styles.quizTitle}>{item.title}</Text>
          <Text style={styles.quizDescription}>{item.description}</Text>
        </TouchableOpacity>
      );
      const logout=()=>{
        signOut(auth);
        navigation.navigate('login');
      }

      return (
        <View style={styles.container}>
       
        {
            loading?(
                <>
                <View style={styles.loading}>
                <ActivityIndicator color="blue" size="large"/>
                <Text style={styles.loadingText}>Loading Quizzes...</Text>
                </View>
                </>

                
            ):(
                <>
                <Text style={styles.text}>Available Quizzes</Text>
                <FlatList
                data={quizzes}
                renderItem={renderQuizItem}
                keyExtractor={(item) => item.id}
                 />
              </>

            )
        }
  
          
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor:'white',
        marginTop:30
      },
      quizItem: {
        marginBottom: 8,
        shadowColor:'gray',
        borderWidth:1,
        padding: 16,
        borderRadius: 12,
        borderColor:"black",
        width:500,
        backgroundColor:'#00008b',
      },
      quizTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'white'
      },
      quizDescription: {
        marginTop: 8,
        color: 'white',
      },
      text:{
        textAlign:'center',
        fontSize:30,
        fontWeight:'bold',
        marginBottom:20,
        marginTop:20

      },
      loading:{
        marginBottom: 8,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding: 16,
        borderRadius: 8,
        width:500,
        marginTop:200

      },
      loadingText:{
        fontSize:20,
        fontWeight:'bold',
        color:'blue'
      }
    });

export default QuizList
