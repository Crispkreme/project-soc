import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadUser, login } from '../services/AuthService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); 
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
        <Text style={styles.header}>Ai-Timan</Text>
        <Text style={styles.subtitle}>Streamlining Outpatient Care</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#001f3f',
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#a8c0ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    marginBottom: 15,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  toggleButtonText: {
    color: '#001f3f',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4d4d',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#00509e',
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
  },
  footerLink: {
    color: '#00aaff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
