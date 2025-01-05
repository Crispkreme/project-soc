import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Button } from "react-native-paper";
import Collapsible from "react-native-collapsible";
import { getTestResult, getImmunizationResult, getHospitalizationResult, getPrescriptionResult } from "../services/MedicalResult";

const PatientRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [testResults, setTestResults] = useState([]);
  const [immunizationResults, setImmunizationResults] = useState([]);
  const [hospitalizationResults, setHospitalizationResults] = useState([]);
  const [prescriptionResults, setPrescriptionResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
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

    if (user.id) {
      fetchResults();
    }
  }, [user.id]);

  const handleAdd = (type) => {
    Alert.alert(`Add ${type}`, `Add functionality for ${type} goes here.`);
  };

  const handleEdit = (item) => {
    Alert.alert("Edit", `Edit functionality for ${JSON.stringify(item)} goes here.`);
  };

  const handleDelete = (item) => {
    Alert.alert("Delete", `Delete functionality for ${JSON.stringify(item)} goes here.`);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderTable = (title, data, headers, section) => (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        titleStyle={styles.cardTitle}
        right={() => (
          <Button onPress={() => toggleSection(section)} mode="text">
            {activeSection === section ? "Collapse" : "Expand"}
          </Button>
        )}
      />

      <Collapsible collapsed={activeSection !== section}>
        <Button mode="contained" onPress={() => handleAdd(title)} style={styles.addButton}>
          Add {title}
        </Button>

        <ScrollView horizontal>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.row, styles.headerRow]}>
              {headers.map((header, i) => (
                <View key={i} style={styles.headerCell}>
                  <Text style={styles.headerText}>{header}</Text>
                </View>
              ))}
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Actions</Text>
              </View>
            </View>

            {/* Table Body */}
            {data.length > 0 ? (
              data.map((item, index) => (
                <View
                  key={index}
                  style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                >
                  {headers.map((header, i) => (
                    <View key={i} style={styles.cell}>
                      <Text style={styles.cellText}>{item[header.toLowerCase()] || "N/A"}</Text>
                    </View>
                  ))}

                  <View style={styles.actions}>
                    <Button onPress={() => handleEdit(item)} style={styles.actionButton}>
                      Edit
                    </Button>
                    <Button onPress={() => handleDelete(item)} style={styles.actionButton}>
                      Delete
                    </Button>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noDataWrapper}>
                <Text style={styles.noDataText}>No records found.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Collapsible>
    </Card>
  );

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
    <SafeAreaView style={styles.container}>
      {renderTable("Test Result", testResults, ["Test", "Result", "Date"], "test")}
      {renderTable("Immunization", immunizationResults, ["Immunization", "Doctor", "Date"], "immunization")}
      {renderTable("Hospitalization", hospitalizationResults, ["Diagnosis", "Hospital", "Doctor", "Date"], "hospitalization")}
      {renderTable("Prescription", prescriptionResults, ["Diagnosis", "Medicine", "Date"], "prescription")}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f1f5f9",
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
  },
  headerRow: {
    backgroundColor: "#e5e7eb",
  },
  headerCell: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  cellText: {
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f8fafc",
  },
  oddRow: {
    backgroundColor: "#e2e8f0",
  },
  actionButton: {
    backgroundColor: "#007bff",
    color: "white",
    margin: 5,
  },
  noDataWrapper: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    color: "#64748b",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});

export default PatientRecordScreen;
