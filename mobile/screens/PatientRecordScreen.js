import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getTestResult, getImmunizationResult } from "../services/MedicalResult";

const PatientRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [testResults, setTestResults] = useState([]); 
  const [immunizationResults, setImmunizationResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);

        const { testResult } = await getTestResult(user.id);
        const { immunizations: immunizationResultData } = await getImmunizationResult(user.id);

        console.log('Immunization Results:', immunizationResultData);

        setTestResults(testResult || []);
        setImmunizationResults(immunizationResultData || []);

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
      fetchTestResults();
    }
  }, [user.id]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.tableContainer}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Test</Text>
          <Text style={styles.headerCell}>Result</Text>
          <Text style={styles.headerCell}>Date</Text>
        </View>
        {testResults.length > 0 ? (
          testResults.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.result}</Text>
              <Text style={styles.cell}>{item.created_at}</Text>
            </View>
          ))
        ) : (
          <Text>No test results found.</Text>
        )}
      </ScrollView>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Immunization</Text>
          <Text style={styles.headerCell}>Doctor</Text>
          <Text style={styles.headerCell}>Date</Text>
        </View>
        {immunizationResults.length > 0 ? (
          immunizationResults.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.immunization}</Text>
              <Text style={styles.cell}>{item.doctor_name}</Text>
              <Text style={styles.cell}>{item.created_at}</Text>
            </View>
          ))
        ) : (
          <Text>No immunizations found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  tableContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PatientRecordScreen;
