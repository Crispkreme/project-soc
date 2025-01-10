import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChangeEmailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Change Email Screen</Text>
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

export default ChangeEmailScreen;
