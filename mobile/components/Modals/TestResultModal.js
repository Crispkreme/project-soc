import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { storeTestResult as storeTestResultService } from "../../services/MedicalRecord";

const TestResultModal = ({ visible, onClose, userId }) => {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleStoreTestResult = async () => {
    if (!name || !result) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        patient_id: userId,
        name,
        result,
      };

      const response = await storeTestResultService(submissionData);

      if (response && response.success) {
        Alert.alert("Success", "Test result saved successfully.");
        setName("");
        setResult("");
        onClose();
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to save test result."
        );
      }
    } catch (error) {
      console.error("Error storing test result:", error);
      Alert.alert(
        "Error",
        "Failed to save test result. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Test Result</Text>

          <TextInput
            placeholder="Test Name (e.g. Disease or Test)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Test Result"
            value={result}
            onChangeText={setResult}
            style={styles.input}
            multiline
          />

          <Button
            title={submitting ? "Saving..." : "Add Test Result"}
            onPress={handleStoreTestResult}
            disabled={submitting}
          />
          <Button
            title="Close"
            onPress={() => {
              setName("");
              setResult("");
              onClose();
            }}
            color="red"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
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

export default TestResultModal;
