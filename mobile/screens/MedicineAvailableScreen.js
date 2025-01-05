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
import { Card } from "react-native-paper";
import { getMedicineAvailable } from "../services/MedicineAvailable";

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
        console.log('Fetched Data:', medicineAvailableData);

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

  const renderTable = (title, data, headers) => (
    <Card style={styles.card}>
      <Card.Title title={title} titleStyle={styles.cardTitle} />
      <ScrollView horizontal>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.row}>
            {headers.map((header, i) => (
              <View key={i} style={styles.headerCell}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Table Body */}
          {data.length > 0 ? (
            data.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                {Object.values(item).map((value, i) => (
                  <View key={i} style={styles.cell}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.cellText}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.noDataWrapper}>
              <Text style={styles.noDataText}>No records found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Card>
  );

  // Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderTable(
        "Medicine Available",
        medicineAvailable,
        ["Medicine", "Description", "Dosage", "Sold", "In Stock", "Expiration Date"]
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    width: 150,
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  cellText: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f8fafc",
  },
  oddRow: {
    backgroundColor: "#e2e8f0",
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

export default MedicineAvailableScreen;
