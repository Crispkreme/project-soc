import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Alert } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { getTestResult, getImmunizationResult } from "../services/MedicalResult";

const PatientRecordScreen = ({ route }) => {
  const { user } = route.params;
  const [testResults, setTestResults] = useState([]);
  const [immunizationResults, setImmunizationResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSections, setActiveSections] = useState([]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const { testResult } = await getTestResult(user.id);
        const { immunizations: immunizationResultData } = await getImmunizationResult(user.id);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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

  const renderSectionHeader = (section) => {
    return (
      <View style={styles.row}>
        <Text style={styles.headerCell}>{section.title}</Text>
      </View>
    );
  };

  const renderSectionContent = (section) => {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.row}>
          {section.title === 'Test Results' ? (
            <>
              <Text style={[styles.cell, styles.headerCell]}>Test</Text>
              <Text style={[styles.cell, styles.headerCell]}>Result</Text>
              <Text style={[styles.cell, styles.headerCell]}>Date</Text>
            </>
          ) : (
            <>
              <Text style={[styles.cell, styles.headerCell]}>Immunization</Text>
              <Text style={[styles.cell, styles.headerCell]}>Doctor</Text>
              <Text style={[styles.cell, styles.headerCell]}>Date</Text>
            </>
          )}
        </View>
        {section.data.length > 0 ? (
          section.data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.name || item.immunization}</Text>
              <Text style={styles.cell}>{item.result || item.doctor_name}</Text>
              <Text style={styles.cell}>{item.created_at}</Text>
            </View>
          ))
        ) : (
          <Text>No data found.</Text>
        )}
      </View>
    );
  };

  const sections = [
    {
      title: 'Test Results',
      data: testResults
    },
    {
      title: 'Immunization Results',
      data: immunizationResults
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderSectionHeader}
        renderContent={renderSectionContent}
        onChange={(sections) => setActiveSections(sections)}
        style={styles.accordion}
      />a
    </SafeAreaView>
  );
};

export default PatientRecordScreen;

const styles = {
  container: {
    flex: 1,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
  },
  accordion: {
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    width: '30%',
    textAlign: 'center',
  },
  cell: {
    width: '30%',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};
