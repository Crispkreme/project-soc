import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Button } from 'react-native';
import { updateUserEmail } from '../services/AuthService';

const ChangeEmailScreen = ({ route }) => {
  const { user } = route.params || {};

  if (!user) {
    Alert.alert("Error", "User data is missing!"); 
    return null; 
  }

  const [newEmail, setNewEmail] = useState(user?.email || '');

  const handleInputChange = (text) => {
    setNewEmail(text); 
  };

  const handleSubmit = async () => {
    if (!newEmail || newEmail === user.email) {
      Alert.alert('Error', 'Please provide a valid new email.');
      return;
    }

    try {
      const data = { 
        user_id: user.id,
        email: newEmail,
      };

      const response = await updateUserEmail(data);

      console.log('Update response:', response);

      if (response?.user) {
        Alert.alert('Success', 'Email updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update email, please try again.');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert('Error', 'Failed to update email, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Email"
        value={user.email}
        editable={false}
      />

      <Text>New Email</Text>
      <TextInput
        style={styles.input}
        placeholder="New Email"
        value={newEmail}
        onChangeText={handleInputChange}
      />

      <Button title="Update Email" onPress={handleSubmit} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default ChangeEmailScreen;
