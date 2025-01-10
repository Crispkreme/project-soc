import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeactivateAccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Deactivate Account Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeactivateAccountScreen;
