import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccountDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Account Detail Screen</Text>
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

export default AccountDetailScreen;
