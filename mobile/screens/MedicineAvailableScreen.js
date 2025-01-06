import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Card } from "react-native-paper";
import { getMedicineAvailable } from "../services/MedicineAvailable";
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import moment from 'moment';
import { LinearGradient } from "expo-linear-gradient";

const MedicineAvailableScreen = ({ route }) => {
  const { user } = route.params;
  const [medicineAvailable, setMedicineAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicineData = async () => {
      try {
        setLoading(true);
        const { inventories: medicineAvailableData } = await getMedicineAvailable(user.id);

        setMedicineAvailable(medicineAvailableData || []);
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
      fetchMedicineData();
    }
  }, [user.id]);

  const formatExpirationDate = (date) => {
    const formattedDate = moment(date, 'MMMM DD, YYYY', true);
    return formattedDate.isValid() ? formattedDate.format("MMM DD, YYYY") : 'Invalid Date';
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

  const formattedMedicineData = medicineAvailable.map(item => ({
    ...item,
    expiration_date: formatExpirationDate(item.expiration_date),
  }));

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Card style={[styles.card, { width: '100%', backgroundColor: 'white' }]}>
          <Text style={styles.headerText}>Medicine Available</Text>

          <DataTable
            data={formattedMedicineData}
            colNames={["medicine", "description", "dosage", "sold", "in_stock", "expiration_date"]}
            colSettings={[
              { name: 'medicine', type: COL_TYPES.STRING, width: '25%' },
              { name: 'description', type: COL_TYPES.STRING, width: '25%' },
              { name: 'dosage', type: COL_TYPES.STRING, width: '15%' },
              { name: 'sold', type: COL_TYPES.INT, width: '10%' },
              { name: 'in_stock', type: COL_TYPES.INT, width: '10%' },
              { name: 'expiration_date', type: COL_TYPES.STRING, width: '15%' },
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
    padding: 10,
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

export default MedicineAvailableScreen;
