import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import {
  getHealthRecord,
  getSurgicalRecord,
  getMedicationRecord,
  getFamilyMedicalRecord,
} from "../services/MedicalResult";
import DataTable, { COL_TYPES } from "react-native-datatable-component";
import { Card, Button } from "react-native-paper";

import FamilyRecordModal from "../components/Modals/FamilyRecordModal";
import HealthRecordModal from "../components/Modals/HealthRecordModal";
import MedicationRecordModal from "../components/Modals/MedicationRecordModal";
import SurgicalRecordModal from "../components/Modals/SurgicalRecordModal";

const renderTable = (title, data, colNames, colSettings, handleAdd) => (
  <Card style={[styles.card, { backgroundColor: "white" }]}>
    <Text style={styles.headerText}>{title}</Text>
    {data.length > 0 ? (
      <View style={styles.tableContainer}>
        <DataTable
          data={data.map((item) => {
            if (title === "Health Records") {
              return {
                medicine: item.medicine || "No Medicine",
                procedure: item.diagnosis || "No Diagnosis",
                date: item.created_at,
              };
            }
            if (title === "Surgical Records") {
              return {
                test: item.description,
                result: item.doctor,
                date: item.created_at,
              };
            }
            if (title === "Medication Records") {
              return {
                medicine_name: item.medicine_name || "No Medicine",
                reason: item.reason || "No Reason",
                date: item.date,
              };
            }
            if (title === "Family Medical Records") {
              return {
                disease: item.disease || "No Disease",
                relationship: item.relationship || "No Relationship",
                date: item.date,
              };
            }
            return {};
          })}
          colNames={colNames}
          colSettings={colSettings}
          noOfPages={2}
          backgroundColor={"white"}
          headerLabelStyle={{ color: "grey", fontSize: 12 }}
          style={{ marginTop: 10 }}
        />
      </View>
    ) : (
      <Text style={styles.noDataText}>No records found.</Text>
    )}
    <Button
      mode="contained"
      onPress={() => handleAdd(title)}
      style={styles.addButton}
    >
      Add {title}
    </Button>
  </Card>
);

const MedicalRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [healthRecords, setHealthRecord] = useState([]);
  const [surgicalRecords, setSurgicalRecord] = useState([]);
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [familyMedicalRecord, setFamilyMedicalRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(null);

  // Fetch records
  const fetchTestResults = async () => {
    try {
      setLoading(true);

      const healthRecordData = await getHealthRecord(user.id);
      const surgicalRecordData = await getSurgicalRecord(user.id);
      const medicationRecordData = await getMedicationRecord(user.id);
      const familyMedicalRecordData = await getFamilyMedicalRecord(user.id);

      setHealthRecord(healthRecordData?.medical_records || []);
      setSurgicalRecord(surgicalRecordData?.surgicalRecords || []);
      setMedicationRecords(medicationRecordData?.medicationRecords || []);
      setFamilyMedicalRecord(familyMedicalRecordData?.familyMedicalRecords || []);

      setLoading(false);
    } catch (err) {
      console.error("Axios error:", err.response || err.message);
      setLoading(false);

      if (err.response?.status === 422) {
        setError(err.response.data?.errors || "Validation error");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  // Use effect to fetch records when the screen is loaded
  useEffect(() => {
    if (user.id) {
      fetchTestResults();
    }
  }, [user.id]);

  // Handle add button press to show modals
  const handleAdd = (type) => {
    if (type === "Health Records") setVisibleModal("HealthRecord");
    if (type === "Surgical Records") setVisibleModal("SurgicalRecord");
    if (type === "Medication Records") setVisibleModal("MedicationRecord");
    if (type === "Family Medical Records") setVisibleModal("FamilyRecord");
  };

  // Handle the closing of a modal and refetch records when a new record is added
  const handleCloseModalAndRefresh = (type) => {
    setVisibleModal(null); // Close the modal
    fetchTestResults(); // Refetch all records
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{JSON.stringify(error)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {renderTable(
          "Health Records",
          healthRecords,
          ["medicine", "procedure", "date"],
          [
            { name: "medicine", type: COL_TYPES.STRING, width: "40%" },
            { name: "procedure", type: COL_TYPES.STRING, width: "40%" },
            { name: "date", type: COL_TYPES.STRING, width: "20%" },
          ],
          handleAdd
        )}
        {renderTable(
          "Surgical Records",
          surgicalRecords,
          ["test", "result", "date"],
          [
            { name: "test", type: COL_TYPES.STRING, width: "30%" },
            { name: "result", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ],
          handleAdd
        )}
        {renderTable(
          "Medication Records",
          medicationRecords,
          ["medicine_name", "reason", "date"],
          [
            { name: "medicine_name", type: COL_TYPES.STRING, width: "30%" },
            { name: "reason", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ],
          handleAdd
        )}
        {renderTable(
          "Family Medical Records",
          familyMedicalRecord,
          ["disease", "relationship", "date"],
          [
            { name: "disease", type: COL_TYPES.STRING, width: "30%" },
            { name: "relationship", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ],
          handleAdd
        )}
      </ScrollView>

      {visibleModal === "HealthRecord" && (
        <HealthRecordModal visible onClose={() => handleCloseModalAndRefresh("HealthRecord")} userId={user.id} />
      )}
      {visibleModal === "SurgicalRecord" && (
        <SurgicalRecordModal visible onClose={() => handleCloseModalAndRefresh("SurgicalRecord")} userId={user.id} />
      )}
      {visibleModal === "MedicationRecord" && (
        <MedicationRecordModal visible onClose={() => handleCloseModalAndRefresh("MedicationRecord")} userId={user.id} />
      )}
      {visibleModal === "FamilyRecord" && (
        <FamilyRecordModal visible onClose={() => handleCloseModalAndRefresh("FamilyRecord")} userId={user.id} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 10,
    color: "grey",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  tableContainer: {
    marginBottom: 20,
  },
});

export default MedicalRecordScreen;
