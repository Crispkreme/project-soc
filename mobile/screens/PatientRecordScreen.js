import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Card, Button } from "react-native-paper";
import DataTable, { COL_TYPES } from "react-native-datatable-component";
import {
  getTestResult,
  getImmunizationResult,
  getHospitalizationResult,
  getPrescriptionResult,
} from "../services/MedicalResult";

import TestResultModal from "../components/Modals/TestResultModal";
import ImmunizationResultModal from "../components/Modals/ImmunizationResultModal";
import HospitalizationResultModal from "../components/Modals/HospitalizationResultModal";
import PrescriptionResultModal from "../components/Modals/PrescriptionResultModal";
import { LinearGradient } from "expo-linear-gradient";

const PatientRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [testResults, setTestResults] = useState([]);
  const [immunizationResults, setImmunizationResults] = useState([]);
  const [hospitalizationResults, setHospitalizationResults] = useState([]);
  const [prescriptionResults, setPrescriptionResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleModal, setVisibleModal] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { testResult } = await getTestResult(user.id);
      const { immunizations } = await getImmunizationResult(user.id);
      const { hospitalizations } = await getHospitalizationResult(user.id);
      const { medical_records } = await getPrescriptionResult(user.id);
      
      setTestResults(testResult || []);
      setImmunizationResults(immunizations || []);
      setHospitalizationResults(hospitalizations || []);
      setPrescriptionResults(medical_records || []);
      setLoading(false);

    } catch (err) {
      console.error("Axios error:", err.response || err.message);
      setLoading(false);
      if (err.response?.status === 422) {
        setError(err.response.data.errors);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchResults();
    }
  }, [user.id]);

  const renderTable = (title, data, colNames, colSettings) => (
    <Card style={[styles.card, { backgroundColor: "white" }]}>
      <Text style={styles.headerText}>{title}</Text>

      {data.length > 0 ? (
        <DataTable
          data={data.map((item) => {
            if (title === "Test Result") {
              return {
                test: item.name,
                result: item.result,
                date: item.created_at,
              };
            }
            if (title === "Immunization") {
              return {
                test: item.immunization,
                result: item.result,
                date: item.created_at,
              };
            }
            if (title === "Hospitalization") {
              return {
                test: item.hospital,
                result: item.doctor_name,
                date: item.created_at,
              };
            }
            if (title === "Prescription") {
              return {
                diagnosis: item.diagnosis,
                medicine: item.medicine,
                date: item.created_at,
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
      ) : (
        <Text style={styles.noDataText}>No records found.</Text>
      )}

      <Button mode="contained" onPress={() => handleAdd(title)} style={styles.addButton}>
        Add {title}
      </Button>
    </Card>
  );

  const handleAdd = (type) => {
    switch (type) {
      case "Test Result":
        setVisibleModal("TestResult");
        break;
      case "Immunization":
        setVisibleModal("ImmunizationResult");
        break;
      case "Hospitalization":
        setVisibleModal("HospitalizationResult");
        break;
      case "Prescription":
        setVisibleModal("PrescriptionResult");
        break;
      default:
        break;
    }
  };

  const handleCloseModalAndRefresh = () => {
    setVisibleModal(null);
    // Refetch the data after closing the modal
    fetchResults();
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
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']} // Example gradient colors
      style={styles.container} // Gradient wraps the entire container
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {renderTable(
          "Test Result",
          testResults,
          ["test", "result", "date"],
          [
            { name: "test", type: COL_TYPES.STRING, width: "30%" },
            { name: "result", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ]
        )}
        {renderTable(
          "Immunization",
          immunizationResults,
          ["test", "result", "date"],
          [
            { name: "test", type: COL_TYPES.STRING, width: "30%" },
            { name: "result", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ]
        )}
        {renderTable(
          "Hospitalization",
          hospitalizationResults,
          ["test", "result", "date"],
          [
            { name: "test", type: COL_TYPES.STRING, width: "30%" },
            { name: "result", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ]
        )}
        {renderTable(
          "Prescription",
          prescriptionResults,
          ["diagnosis", "medicine", "date"],
          [
            { name: "diagnosis", type: COL_TYPES.STRING, width: "30%" },
            { name: "medicine", type: COL_TYPES.STRING, width: "30%" },
            { name: "date", type: COL_TYPES.STRING, width: "40%" },
          ]
        )}
      </ScrollView>

      {/* Modals for adding new records */}
      {visibleModal === "TestResult" && (
        <TestResultModal
          visible
          onClose={handleCloseModalAndRefresh}
          userId={user.id}
        />
      )}
      {visibleModal === "ImmunizationResult" && (
        <ImmunizationResultModal
          visible
          onClose={handleCloseModalAndRefresh}
          userId={user.id}
        />
      )}
      {visibleModal === "HospitalizationResult" && (
        <HospitalizationResultModal
          visible
          onClose={handleCloseModalAndRefresh}
          userId={user.id}
        />
      )}
      {visibleModal === "PrescriptionResult" && (
        <PrescriptionResultModal
          visible
          onClose={handleCloseModalAndRefresh}
          userId={user.id}
        />
      )}
    </LinearGradient>
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
});

export default PatientRecordScreen;
