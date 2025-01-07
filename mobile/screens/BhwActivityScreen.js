import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { getScheduleConsultation } from "../services/ScheduleConsultation";
import { LinearGradient } from "expo-linear-gradient";

const Event = ({ event }) => {
  const isBooking = !!event.event_name;
  const eventDate = new Date(isBooking ? event.event_date : event.date);
  const day = String(eventDate.getDate()).padStart(2, "0");

  const formatTimeToAMPM = (time) => {
    if (!time) return "";
    const [hour, minute] = (time || "00:00").split(":");
    const parsedHour = parseInt(hour, 10);
    const ampm = parsedHour >= 12 ? "PM" : "AM";
    const formattedHour = parsedHour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <View style={styles.eventCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{day}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{event.event_name || "No Title"}</Text>
        <Text style={styles.eventInfo}>
          {formatTimeToAMPM(event.event_time) || "Time not available"}
        </Text>
        <Text style={styles.eventInfo}>{event.venue || "Venue not specified"}</Text>
      </View>
    </View>
  );
};

const Month = ({ period, events }) => {
  const [visible, setVisible] = useState(false);

  const handleOnClick = () => setVisible(!visible);

  return (
    <TouchableOpacity
      onPress={handleOnClick}
      activeOpacity={0.8}
      style={styles.monthContainer}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{period}</Text>
      </View>
      {visible && (
        <ScrollView horizontal>
          <View style={styles.eventGrid}>
            {events.length > 0 ? (
              events.map((event, index) => <Event key={index} event={event} />)
            ) : (
              <Text>No events available</Text>
            )}
          </View>
        </ScrollView>
      )}
    </TouchableOpacity>
  );
};

const BhwActivityScreen = ({ route }) => {
  const { user } = route.params;
  const [medicalCertificate, setMedicalCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = Object.keys(medicalCertificate);

  const record = months.map((month) => ({
    period: month,
    events: medicalCertificate[month],
  }));

  useEffect(() => {
    const fetchMedicalCertificate = async () => {
      try {
        setLoading(true);
        const { groupedEvents: scheduleConsultationData } = await getScheduleConsultation();
        console.log("Fetched Data:", scheduleConsultationData);

        setMedicalCertificate(scheduleConsultationData || {});
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      {/* Apply gradient background to the whole screen */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']} // Gradient colors
        style={styles.container} // Gradient wraps the entire container
      >
        {record.length > 0 ? (
          record.map((monthData, idx) => (
            <Month
              key={idx}
              period={monthData.period}
              events={monthData.events}
            />
          ))
        ) : (
          <Text style={styles.noEventsText}>No consultations found.</Text>
        )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    elevation: 3,
  },
  dateContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0288D1",
  },
  eventDetails: {
    marginLeft: 16,
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventInfo: {
    fontSize: 14,
    color: "#616161",
  },
  monthContainer: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    overflow: "hidden",
  },
  headerContainer: {
    backgroundColor: "#81D4FA",
    padding: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventGrid: {
    padding: 16,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default BhwActivityScreen;
