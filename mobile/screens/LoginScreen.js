import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Button, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadUser, login } from '../services/AuthService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);  // Track password visibility
  const navigation = useNavigation();

  async function handleLogin() {
    setErrors({});
    try {
      await login({
        email,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      const user = await loadUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard', params: { user } }],
      });
    } catch (err) {
      console.error('Axios error:', err.response || err.message);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>

        {/* Email Field */}
        <Text>Email Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Password Field with Show/Hide Toggle */}
        <Text>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}  // Toggle visibility
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
          >
            <Text>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    width: '100%',
    rowGap: 15,
  },
  header: {
    color: '#334155',
    fontWeight: '500',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default LoginScreen;
