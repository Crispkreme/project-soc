import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getMedicalCertificate } from "../services/MedicalCertificate";
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import moment from 'moment';
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const MedicalCertificateScreen = ({ route }) => {
  const { user } = route.params;
  const [medicalCertificate, setMedicalCertificate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalCertificate = async () => {
      try {
        setLoading(true);
        const { medicalCertificates: medicalCertificateData } = await getMedicalCertificate(user.id);
        console.log('medicalCertificateData', medicalCertificateData); 
        setMedicalCertificate(medicalCertificateData || []);
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
      fetchMedicalCertificate();
    }
  }, [user.id]);

  const formatExpirationDate = (date) => {
    const trimmedDate = date.trim();
    const formattedDate = moment(trimmedDate, 'DD/MM/YYYY', true);    
    return formattedDate.isValid() ? formattedDate.format("MMM DD, YYYY") : 'Invalid Date';
  };

  const formattedMedicineData = medicalCertificate.map(item => ({
    ...item,
    examin_date: formatExpirationDate(item.examin_date),
    issue_date: formatExpirationDate(item.issue_date),
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
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
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Card style={[styles.card, { marginTop: 20, backgroundColor: 'white' }]}>
          <Text style={styles.headerText}>Medical Certificate</Text>

          <DataTable
            data={formattedMedicineData}
            colNames={["purpose", "doctor_name", "examin_date", "issue_date"]}
            colSettings={[
              { name: 'purpose', type: COL_TYPES.STRING, width: '30%' },
              { name: 'doctor_name', type: COL_TYPES.STRING, width: '30%' },
              { name: 'examin_date', type: COL_TYPES.STRING, width: '20%' },
              { name: 'issue_date', type: COL_TYPES.STRING, width: '20%' },
            ]}
            noOfPages={2}
            backgroundColor={'white'}
            headerLabelStyle={{ color: 'grey', fontSize: 12 }}
            style={{ marginTop: 10 }}
          />
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    padding: 20,
    borderRadius: 8,
    elevation: 3,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});

export default MedicalCertificateScreen;
