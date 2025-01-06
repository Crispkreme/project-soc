import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button, StyleSheet
} from "react-native";

const FamilyRecordModal = ({ visible, onClose, onAdd }) => {
  const [disease, setDisease] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleAdd = () => {
    if (disease && relationship) {
      onAdd({ disease, relationship, date: new Date().toISOString() });
      setDisease("");
      setRelationship("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.modalHeader}>Add Family Record</Text>
        <TextInput
          placeholder="Disease"
          value={disease}
          onChangeText={setDisease}
          style={styles.input}
        />
        <TextInput
          placeholder="Relationship"
          value={relationship}
          onChangeText={setRelationship}
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

export default FamilyRecordModal;
