import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { getMedicineAvailable } from "../services/MedicineAvailable";

const MedicineAvailableScreen = ({ route }) => {
  const { user } = route.params;
  const [medicineAvailable, setMedicineAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalCertificate = async () => {
      try {
        setLoading(true);
        const { inventories: medicineAvailableData } = await getMedicineAvailable(user.id);
        console.log('medicineAvailableData', medicineAvailableData);

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
      fetchMedicalCertificate();
    }
  }, [user.id]);

  const renderTable = (title, data, headers) => (
    <View>
      <View style={styles.headerWrapper}>
        <Text style={styles.sectionHeader}>{title}</Text>
      </View>
      <ScrollView horizontal style={styles.tableContainer}>
        <ScrollView style={styles.verticalScroll}>
          <View style={styles.row}>
            {headers.map((header, i) => (
              <Text key={i} style={styles.headerCell}>{header}</Text>
            ))}
          </View>
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
      </ScrollView>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      {renderTable('Medicine Available', medicineAvailable, ['Medicine', 'Description', 'Dosage', 'Sold', 'In Stock', 'Expiration Date'])}
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
  verticalScroll: {
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

export default MedicineAvailableScreen;
