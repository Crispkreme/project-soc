import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormTextField({ label, errors = [], ...rest }) {
  return (
    <View style={{ marginBottom: 0 }}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={styles.textInput}
        autoCapitalize='none'
        {...rest}
      />
      {errors.map((err) => {
        return <Text key={err} styles={styles.error}>{err}</Text>
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    label: { color: '#334155', fontWeight: '500', marginBottom: 10 },
    textInput: {
      backgroundColor: '#f1f5f9',
      height: 40,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#cbd5e1',
      paddingHorizontal: 10,
    },
    error: { color: '#FF0000', marginTop: 2 },
})