import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button, StyleSheet
} from "react-native";

// Health Record Modal
const MedicationRecordModal = ({ visible, onClose, onAdd }) => {
  const [medicine, setMedicine] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = () => {
    if (medicine && reason) {
      onAdd({ medicine, reason, date: new Date().toISOString() });
      setMedicine("");
      setReason("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.modalHeader}>Add Medication Record</Text>
        <TextInput
          placeholder="Medicine Name"
          value={medicine}
          onChangeText={setMedicine}
          style={styles.input}
        />
        <TextInput
          placeholder="Reason"
          value={reason}
          onChangeText={setReason}
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

export default MedicationRecordModal;
