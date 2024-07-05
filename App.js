import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Switch } from 'react-native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from './firebaseConfig';

export default function App() {
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = collection(FIREBASE_DB, 'tasks');

    const subscriber = onSnapshot(tasksRef, {
      next: (snapshot) => {
        const localTasks = [];
        snapshot.docs.forEach((taskDoc) => {
          localTasks.push({
            id: taskDoc.id,
            ...taskDoc.data()
          });
        });

        setTasks(localTasks);
      }
    });

    return () => subscriber();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim() !== '') {
      try {
        await addDoc(collection(FIREBASE_DB, 'tasks'), {
          title: taskTitle,
          done: false
        });
        setTaskTitle('');
      } catch (error) {
        console.log('Error adding the task:', error);
      }
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const taskRef = doc(FIREBASE_DB, 'tasks', taskId);
    try {
      await updateDoc(taskRef, {
        done: !currentStatus
      });
    } catch (error) {
      console.log('Error updating the task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(FIREBASE_DB, 'tasks', taskId);
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.log('Error deleting the task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button
        title="Add Task"
        onPress={addTask}
        disabled={taskTitle.trim() === ''}
      />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={item.done ? styles.taskTitleDone : styles.taskTitle}>{item.title}</Text>
            <Switch
              value={item.done}
              onValueChange={() => toggleTaskStatus(item.id, item.done)}
            />
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
  },
  taskTitleDone: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  delete: {
    color: 'red',
  },
});
