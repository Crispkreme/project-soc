import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button, StyleSheet
} from "react-native";

// Surgical Record Modal
const SurgicalRecordModal = ({ visible, onClose, onAdd }) => {
  const [test, setTest] = useState("");
  const [result, setResult] = useState("");

  const handleAdd = () => {
    if (test && result) {
      onAdd({ test, result, date: new Date().toISOString() });
      setTest("");
      setResult("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.modalHeader}>Add Surgical Record</Text>
        <TextInput
          placeholder="Test"
          value={test}
          onChangeText={setTest}
          style={styles.input}
        />
        <TextInput
          placeholder="Result"
          value={result}
          onChangeText={setResult}
          style={styles.input}
        />
        <Button title="Add Record" onPress={handleAdd} />
        <Button title="Close" onPress={onClose} color="red" />
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default SurgicalRecordModal;
