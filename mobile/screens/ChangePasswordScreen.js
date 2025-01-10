import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Button, TouchableOpacity } from 'react-native';
import { updateUserPassword } from '../services/AuthService';

const ChangePasswordScreen = ({ route }) => {
  const { user } = route.params || {};

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // States to toggle visibility of passwords
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  if (!user) {
    Alert.alert("Error", "User data is missing!");
    return null;
  }

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    try {
      const data = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
        user_id: user.id,
      };      
      const response = await updateUserPassword(data);

      if (response?.success) {
        Alert.alert('Success', 'Password updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update password, please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Alert.alert('Error', 'Failed to update password, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Current Password"
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
          <Text style={styles.toggleText}>{showCurrentPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Text>New Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Text style={styles.toggleText}>{showNewPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Text>Confirm New Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmNewPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
          <Text style={styles.toggleText}>{showConfirmNewPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Update Password" onPress={handleSubmit} />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    width: '85%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  toggleText: {
    marginLeft: 10,
    color: 'blue',
  },
});

export default ChangePasswordScreen;
