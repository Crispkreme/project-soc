import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllMedicine } from "../../services/Medicine";
import { storeMedicationRecord as storeMedicationRecordService } from "../../services/MedicalRecord";

const MedicationRecordModal = ({ visible, onClose, userId }) => {
  const [reason, setReason] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [medicineId, setMedicineId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!visible) return;
      setLoading(true);
      try {
        const response = await getAllMedicine();

        setMedicines(response);

      } catch (err) {
        console.error("Error fetching medicines:", err);
        Alert.alert("Error", "Unable to fetch medicines. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [visible]);

  const handleStoreHealthRecord = async () => {
    if (!reason || !dosage || !quantity || !medicineId) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        patient_id: userId,
        medicine_id: medicineId,
        reason,
        dosage,
        quantity,
        medication_status: "Success",
        date: new Date().toISOString(),
      };

      const response = await storeMedicationRecordService(submissionData);

      if (response && response.success) {
        Alert.alert("Success", "Health record saved successfully.");
        resetForm();
        onClose();
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to save health record."
        );
      }
    } catch (error) {
      console.error("Error storing health record:", error);
      Alert.alert("Error", "Failed to save health record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason("");
    setDosage("");
    setQuantity("");
    setMedicineId(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Medication Record</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={medicineId}
              onValueChange={(itemValue) => setMedicineId(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Medicine" value={null} />
              {Array.isArray(medicines) && medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Picker.Item
                    key={medicine.id}
                    label={medicine.medicine_name}
                    value={medicine.id}
                  />
                ))
              ) : (
                <Picker.Item label="No medicines available" value={null} />
              )}
            </Picker>
          )}

          <TextInput
            placeholder="Reason"
            value={reason}
            onChangeText={setReason}
            style={styles.input}
          />
          <TextInput
            placeholder="Dosage"
            value={dosage}
            onChangeText={setDosage}
            style={styles.input}
          />
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            title={submitting ? "Saving..." : "Add Medication Record"}
            onPress={handleStoreHealthRecord}
            disabled={submitting}
          />
          <Button
            title="Close"
            onPress={() => {
              resetForm();
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

export default MedicationRecordModal;
