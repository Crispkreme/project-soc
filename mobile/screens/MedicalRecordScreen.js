import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Collapsible from 'react-native-collapsible';
import { getHealthRecord, getSurgicalRecord, getMedicationRecord, getFamilyMedicalRecord } from "../services/MedicalResult";

const MedicalRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [healthRecords, setHealthRecord] = useState([]);
  const [surgicalRecords, setSurgicalRecord] = useState([]);
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [familyMedicalRecord, setFamilyMedicalRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        
        setLoading(true);

        const { healthRecord: healthRecordData } = await getHealthRecord(user.id);
        const { surgicalRecords: surgicalRecordData } = await getSurgicalRecord(user.id);
        const { medicationRecords: medicationRecordData } = await getMedicationRecord(user.id);
        const { familyMedicalRecords: familyMedicalRecordData } = await getFamilyMedicalRecord(user.id);

        setHealthRecord(healthRecordData || []);
        setSurgicalRecord(surgicalRecordData || []);
        setMedicationRecords(medicationRecordData || []);
        setFamilyMedicalRecord(familyMedicalRecordData || []);

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

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderTable = (title, data, headers, section) => (
    <View>
      <TouchableOpacity onPress={() => toggleSection(section)}>
        <View style={styles.headerWrapper}>
          <Text style={styles.sectionHeader}>{title}</Text>
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== section}>
        <ScrollView style={styles.tableContainer}>
          <View style={styles.row}>{headers.map((header, i) => <Text key={i} style={styles.headerCell}>{header}</Text>)}</View>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.row}>
                {Object.values(item).map((value, i) => (
                  <Text key={i} style={styles.cell}>{value}</Text>
                ))}
              </View>
            ))
          ) : (
            <Text>No records found.</Text>
          )}
        </ScrollView>
      </Collapsible>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {Array.isArray(error) ? (
          error.map((err, index) => (
            <Text key={index} style={styles.error}>{err}</Text>
          ))
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderTable('Health Record', healthRecords, ['Illness', 'Description', 'Date'], 'health')}
      {renderTable('Surgical Record', surgicalRecords, ['Procedure', 'Description', 'Doctor', 'Date'], 'surgical')}
      {renderTable('Medication Record', medicationRecords, ['Medicine', 'Dosage', 'Reason', 'Date'], 'medication')}
      {renderTable('Family Medical Record', familyMedicalRecord, ['Disease', 'Relationship', 'Date'], 'family')}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginTop: 60,
    paddingHorizontal: 10,
  },
  headerWrapper: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginBottom: 5,
  },
  sectionHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 10,
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

export default MedicalRecordScreen;
