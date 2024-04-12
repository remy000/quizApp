import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { db } from '../firebaseConfig';
import { collection,getDocs,doc,deleteDoc } from 'firebase/firestore';
import * as SQLite from 'expo-sqlite'
import {useNetInfo} from '@react-native-community/netinfo';
import { AntDesign,MaterialIcons } from '@expo/vector-icons';




const AdminHome = ({navigation}) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading,setLoading]=useState(false);
    const netInfo = useNetInfo();
    useEffect(() => {
        if(netInfo.isConnected){
        fetchQuizzes();
        }else{
            fetchQuizzesOffline();
        }
      }, [netInfo.isConnected]);

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

      const fetchQuizzesOffline = () => {
        const sqldb = SQLite.openDatabase('quiz.db');
        return new Promise((resolve, reject) => {
          sqldb.transaction((transaction) => {
            transaction.executeSql(
              'SELECT * FROM quizzes',
              [],
              (transaction, result) => {
                const quizzes = [];
                for (let i = 0; i < result.rows.length; i++) {
                  const row = result.rows.item(i);
                  quizzes.push(row);
                }
                setQuizzes(quizzes);
                resolve(quizzes);
              },
              (error) => {
                console.error('Failed to fetch quizzes:', error);
                reject(error);
              }
            );
          });
        
        });
      };
      const handleDelete=async(quizId)=>{
        const response=await deleteDoc(doc(db,'quizzes',quizId))
        if(response){
            alert('quiz deleted');
            fetchQuizzes();
        }


      }
      const handleQuizSelect = (quizId) => {
        navigation.navigate('Update', { quizId });
      };
      const handleRefresh = () => {
        if(netInfo.isConnected){
        fetchQuizzes();
        }else{
          fetchQuizzesOffline();
        }
      };

      const renderQuizItem = ({ item }) => (  
        <View style={styles.quizItem}>
          <View>
          <Text style={styles.quizTitle}>{item.title}</Text>
          </View>
          <View style={styles.icons}>
          <MaterialIcons name="edit-document" size={22} color="white"onPress={()=>handleQuizSelect(item.id)}/>
          <TouchableOpacity onPress={()=>handleDelete(item.id)}> 
          <MaterialIcons name="delete" size={22} color="white"/>
          </TouchableOpacity>
         

          </View>   
        </View>
      );




  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
      <Text style={styles.admin}>Welcome, Admin</Text>
        <Button title="⟲" onPress={handleRefresh} color='#00563B' />

      </View>
        
        <Button title='+' color='#00563B' onPress={()=>navigation.navigate('Admin')}></Button>
       
        {
            loading?(
                <>
                <View style={styles.loading}>
                <ActivityIndicator color="#00563B" size="large"/>
                <Text style={styles.loadingText}>Loading Quizzes...</Text>
                </View>
                </>

                
            ):(
                <>
                <Text style={styles.text}>Quizzes</Text>
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
    
  
}

export default AdminHome

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor:'white',
    },
    titleHeader:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between', 
      alignItems:'center'
    },
    admin:{
        fontSize:25,
        fontWeight:'bold',
        marginTop:50,
        marginBottom:50,
        color:'#00563B'
    },
    quizItem: {
      marginBottom: 10,
      paddingRight:50,
      paddingVertical:30,
      width:400,
      backgroundColor:'#00563B',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between'
    },
    icons:{
     display:"flex",
     flexDirection:'row',
     marginLeft:120, 
     gap:20

    },
    quizTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color:'white',
      paddingLeft:10
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
      marginTop:20,
      color:'#00563B'

    },
    loading:{
      marginBottom: 8,
      display:'flex',
      alignItems:'center',  
      padding: 10,
      borderRadius: 8,
      width:400,
      marginTop:200

    },
    loadingText:{
      fontSize:20,
      fontWeight:'bold',
      color:'#00563B'
    }
  });