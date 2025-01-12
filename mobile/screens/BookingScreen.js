import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { Card } from "react-native-paper";

import DataTable, { COL_TYPES } from "react-native-datatable-component";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { getAllBooking } from "../services/Booking";

const BookingScreen = ({ route }) => {
  const { user } = route.params;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
  
        const response = await getAllBooking(user.id);
        console.log("Booking Response:", response.data);
  
        if (Array.isArray(response.data.booking)) {
          setBookings(response.data.booking);
        } else {
          setBookings([]);
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err.response || err.message);
        setLoading(false);
  
        if (err.response?.status === 422) {
          setError("Invalid user data. Please contact support.");
        } else {
          setError("Failed to load data. Please try again.");
        }
      }
    };
  
    if (user?.id) {
      fetchBookingData();
    } else {
      setError("User ID is missing.");
      setLoading(false);
    }
  }, [user?.id]);
  
  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MMM DD, YYYY");
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return moment(time, "HH:mm:ss").format("hh:mm A");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size="large" color="#6a11cb" />
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

  const formattedBookings = bookings.map((booking) => ({
    ...booking,
    appointment_date: formatDate(booking.appointment_date),
    appointment_start: formatTime(booking.appointment_start),
    appointment_end: formatTime(booking.appointment_end),
    approved_date: formatDate(booking.approved_date),
  }));

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.headerText}>Bookings</Text>

          {formattedBookings.length > 0 ? (
            <DataTable
              data={formattedBookings}
              colNames={[
                "title",
                "appointment_date",
                "appointment_start",
                "appointment_end",
                "booking_status",
                "reason",
              ]}
              colSettings={[
                { name: "title", type: COL_TYPES.STRING, width: "25%" },
                { name: "appointment_date", type: COL_TYPES.STRING, width: "15%" },
                { name: "appointment_start", type: COL_TYPES.STRING, width: "15%" },
                { name: "appointment_end", type: COL_TYPES.STRING, width: "15%" },
                { name: "booking_status", type: COL_TYPES.STRING, width: "10%" },
                { name: "reason", type: COL_TYPES.STRING, width: "20%" },
              ]}
              noOfPages={2}
              backgroundColor="white"
              headerLabelStyle={styles.tableHeader}
              style={styles.table}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>No bookings available.</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    color: "grey",
    fontSize: 12,
  },
  noDataView: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "grey",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BookingScreen;
