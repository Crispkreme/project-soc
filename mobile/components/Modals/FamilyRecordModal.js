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
import { Picker } from "@react-native-picker/picker";
import { storeFamilyRecord as storeFamilyRecordService } from "../../services/MedicalRecord";

const FamilyRecordModal = ({ visible, onClose, userId }) => {
  const [disease, setDisease] = useState("");
  const [relationshipDisease, setRelationshipDisease] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStoreFamilyRecord = async () => {
    if (!disease || !relationshipDisease) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        patient_id: userId,
        disease,
        relationship_disease: relationshipDisease,
      };

      const response = await storeFamilyRecordService(submissionData);

      if (response && response.success) {
        Alert.alert("Success", "Family record saved successfully.");
        setDisease("");
        onClose();
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to save health record."
        );
      }
    } catch (error) {
      console.error("Error storing family medical record:", error);
      Alert.alert(
        "Error",
        "Failed to save family medical record. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Family Medical Record</Text>

          <TextInput
            placeholder="Disease"
            value={disease}
            onChangeText={setDisease}
            style={styles.input}
          />

          <Picker
            selectedValue={relationshipDisease}
            onValueChange={(itemValue) => setRelationshipDisease(itemValue)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select Relationship" value={null} />
            <Picker.Item
              label="Mother Family Disease"
              value="Mother Family Disease"
            />
            <Picker.Item
              label="Father Family Disease"
              value="Father Family Disease"
            />
          </Picker>

          <Button
            title={submitting ? "Saving..." : "Add Family Medical Record"}
            onPress={handleStoreFamilyRecord}
            disabled={submitting}
          />
          <Button
            title="Close"
            onPress={() => {
              setDisease("");
              setRelationshipDisease(null);
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
  dropdown: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default FamilyRecordModal;
