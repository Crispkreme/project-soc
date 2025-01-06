import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { getMedicineRequester } from "../services/MedicineRequester";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

const MedicineRequesterScreen = ({ route }) => {
  const { user } = route.params; // Extract user from route params
  const [medicineRequester, setMedicineRequester] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicineRequesterData = async () => {
      try {
        setLoading(true);
        const medicineRequesterData = await getMedicineRequester(user.id); // No destructuring
        console.log('medicineRequesterData', medicineRequesterData); // Log the data
        setMedicineRequester(medicineRequesterData || []);
        setLoading(false);
      } catch (err) {
        console.error("Axios error:", err.response || err.message);
        setLoading(false);

        if (err.response?.status === 422) {
          setError(err.response.data.errors); // Handle specific validation errors
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      }
    };

    fetchMedicineRequesterData();
  }, [user.id]);

  // Format the date to display in "MMM DD, YYYY"
  const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).format("MMM DD, YYYY") : "Invalid Date";
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#6a11cb', '#2575fc']} // Gradient colors
        style={styles.container}
      >
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#6a11cb', '#2575fc']} // Gradient colors
        style={styles.container}
      >
        <Text style={styles.error}>{error}</Text>
      </LinearGradient>
    );
  }

  // Render the list of medicine requester data
  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']} // Gradient colors
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          <Text style={styles.headerText}>Medicine Requester</Text>

          {medicineRequester.length > 0 ? (
            medicineRequester.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.medicineName}>{item.medicine_name}</Text>
                <Text style={styles.medicationStatus}>Status: {item.medication_status}</Text>
                <Text style={styles.dosage}>Dosage: {item.dosage}</Text>
                <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.reason}>Reason: {item.reason || "N/A"}</Text>
                <Text style={styles.date}>Requested on: {formatDate(item.created_at)}</Text>
                <Text style={styles.date}>Last Updated: {formatDate(item.updated_at)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No medicine requests available.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff", // White text for contrast on gradient background
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  medicationStatus: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  dosage: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  quantity: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  reason: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  date: {
    fontSize: 12,
    marginTop: 5,
    color: "#888",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MedicineRequesterScreen;
