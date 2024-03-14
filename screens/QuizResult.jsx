import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
const QuizResult = ({route,navigation}) => {

  const { score } = route.params;

  return (
    <View style={styles.container}>
        {
            score&&score >50 ?(
                <>
                <View style={styles.result}>
                <MaterialIcons name="celebration" size={40} color="green" />
                 <Text style={styles.resultText}>Congratulations!!</Text>
                </View>
               
                
                </>
            ):(
                <>
                <View style={styles.result}>
                <FontAwesome5 name="sad-tear" size={40} color="red" />   
                <Text style={styles.failText}>You Failed the Quiz!!</Text>
                </View>
                </>
                

            )
        }
      <Text style={styles.title}>Quiz Result</Text>
      <Text style={styles.score}>Your Score: {score}%</Text>

      <View>
        <TouchableOpacity onPress={()=>navigation.navigate('User')} style={styles.link}>
            <Text style={styles.linkText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  result:{
    display:'flex',
    flexDirection:'row',
    gap:5,
    marginTop:100,
    marginBottom:50

  },
  resultText:{
    fontSize:40,
    color:'green',
    fontWeight:'bold'
  },
  failText:{
    fontSize:30,
    color:'red',
    fontWeight:'bold'

  }
  ,
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop:35
  },
  score: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  link:{
    marginTop:80,
    backgroundColor:'blue',
    padding:13,
    borderRadius:40

  },
  linkText:{
    color:'white',
    fontSize:18,
    fontWeight:'500'
  }
});


export default QuizResult
