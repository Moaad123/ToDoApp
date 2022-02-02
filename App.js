/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Tasks from './components/tasks';
import SQLite from 'react-native-sqlite-storage'
import Icons from 'react-native-vector-icons/MaterialIcons'



const db  = SQLite.openDatabase({
    name : 'dataBase',
    location : 'default'
})

const App = () => {
  const [task,setTask] = useState();
  const [taskList,setTaskList] = useState([]);

  const createTable = () =>{
    db.transaction(txn =>{
      txn.executeSql('CREATE TABLE IF NOT EXISTS todo_liste (ID INTEGER PRIMARY KEY AUTOINCREMENT, texte VARCHAR(300))',[],
      (sqltnx,res)=>{
        console.log('table created successfully ! ')
      },
      error =>{
        console.log('error accured while creating table!')
      })
    })
  }

  const deletetask = (texte)=>{
    db.transaction(txn=>{
      txn.executeSql('DELETE FROM todo_liste WHERE texte=?',
      [texte],
      (sqlite,res)=>{
          console.log('task deleted successfully ! ')
      },
      error=>{
        console.log('error accured when deleting task')
      })
    })
  }

  const Inserttask = (task) =>{
    db.transaction(txn=>{
      txn.executeSql('INSERT INTO todo_liste (texte) VALUES (?)',
      [task],
      (sqltxn,res)=>{
        console.log('data inserted successfully')
      },
      error =>{
        console.log('problem in inserting data !')
      })
    })
  }

  const getTasks = ()=>{
    db.transaction(txn=>{
      txn.executeSql('SELECT * FROM todo_liste ORDER BY id DESC',
      [],
      (sqltxn,res)=>{
        let len = res.rows.length;
        let result = []
        if(len > 0){
          for(let i=0; i<len; i++){
            let item = res.rows.item(i);
            result.push(item.texte);
          }
          setTaskList(result)
        }
      },
      error=>{
        console.log('could not load the data from database ! ')
      })
    })
  }
  useEffect(()=>{
    createTable();
    getTasks()
  },[]);

  const handleadd= () => {
    if(task){
      Keyboard.dismiss();
      setTaskList([...taskList,task]);
      Inserttask(task)
      setTask(null)
    }else{
      alert('The todo can not be empty ! ')
    }
  }
  
  const handledelete  = (index,texte)=>{
    deletetask(texte)
    let taskCopy = [...taskList];
    taskCopy.splice(index,1);
    setTaskList(taskCopy);
  }

  return (  
      <View style={styles.container}>
          <View style={styles.taskView}>
            <Text style={styles.tasksTitle}>
              Today's tasks
            </Text>
            <ScrollView contentContainerStyle={
              {
                flexGrow : 1,
                marginTop : 20,
              }}
              keyboardShouldPersistTaps = 'handled'              
            >
              <View style={styles.items}>
                {
                  taskList.map((item,index)=>{
                    return(
                      <View key={index}>
                        <Tasks text={item} indx={index} delete={handledelete} />
                      </View>
                    )
                  })
                }
              </View>
            </ScrollView>
            </View> 
     
            <KeyboardAvoidingView behavior={Platform.OS == "android" ? "padding" : "height"}style={styles.writetask}>
              <TextInput placeholder={'write a task'} value={task} style={styles.input} onChangeText={text=>setTask(text)}/>
              <TouchableOpacity onPress={()=>handleadd()}>
                <View style={styles.addbtn}>
                  <Text style={styles.textBtn}><Icons name="save" size={30} color="black"></Icons></Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView> 
      </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#E8EAED'
  },
  tasksTitle:{
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold'
  },
  taskView:{
    paddingHorizontal: 20,
    paddingTop: 80,
    marginBottom : 30
  },
  items:{
    marginTop:40,
    marginBottom : 30
  },
  writetask:{
    position: 'absolute',
    width :  '100%',
    marginBottom: 60,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    marginVertical: 10
  },
  addbtn:{
    flex:1,
    justifyContent : 'center',
    alignItems :  'center',
    borderRadius : 60,
    backgroundColor : '#fff',
    borderColor : '#C0C0C0',
    borderWidth: 1,
    width : 60,
    height : 60
  },
  textBtn:{
    fontSize: 50,
    textAlign : 'center',

  },
  input:{
    paddingVertical : 15,
    paddingHorizontal : 15,
    backgroundColor : '#fff',
    borderRadius : 60,
    borderColor : '#C0C0C0',
    borderWidth: 1,
    width: '80%'

  }
});

export default App;
