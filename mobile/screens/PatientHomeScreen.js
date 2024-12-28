import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const PatientHomeScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Welcome Patient, {user.name}</Text>
          <Text style={styles.subText}>Email: {user.email}</Text>
          <Text style={styles.subText}>Phone: {user.phone || 'Not provided'}</Text>
        </>
      ) : (
        <Text style={styles.text}>No user information available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
  },
  subText: {
    fontSize: 16,
    color: '#334155',
    marginTop: 5,
  },
});

export default PatientHomeScreen;
