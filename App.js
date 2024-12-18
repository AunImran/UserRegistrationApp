import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from AsyncStorage on app load
  useEffect(() => {
    loadUsers();
  }, []);

  // Save users list to AsyncStorage
  const saveUsers = async (userList) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(userList));
    } catch (error) {
      console.log('Error saving users:', error);
    }
  };

  // Load users from AsyncStorage
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.log('Error loading users:', error);
    }
  };

  // Add a new user
  const addUser = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newUser = { id: Date.now(), name, email };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Save the updated user list

    setName('');
    setEmail('');
    Alert.alert('Success', 'User added successfully');
  };

  // Clear all users (optional functionality)
  const clearUsers = async () => {
    try {
      await AsyncStorage.removeItem('users');
      setUsers([]);
      Alert.alert('Success', 'All users cleared');
    } catch (error) {
      console.log('Error clearing users:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.button} onPress={addUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Registered Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearUsers}>
        <Text style={styles.buttonText}>Clear Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e2d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#2e2e3d',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b0bec5',
    marginBottom: 10,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#333344',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default App;
