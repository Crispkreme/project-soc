import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { getBarangayEvent, storeBarangayEvent } from "../services/Appointment";

const AppointmentScreen = ({ route }) => {
  const { user } = route.params;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [medicalCertificate, setMedicalCertificate] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    event_name: "",
    event_venue: "",
    event_date: "",
    event_id: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchBarangayEvent = async () => {
      try {
        setLoading(true);
        const response = await getBarangayEvent();
        const barangayEventData = response.barangayEvents;

        if (barangayEventData && barangayEventData.length > 0) {
          setMedicalCertificate(barangayEventData);
          markEventDates(barangayEventData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Axios error:", err.response || err.message);
        setLoading(false);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };

    fetchBarangayEvent();
  }, []);

  const markEventDates = (events) => {
    let marked = {};
    events.forEach((event) => {
      const formattedDate = formatEventDate(event.event_date);
      marked[formattedDate] = {
        marked: true,
        dotColor: "red",
      };
    });
    setMarkedDates(marked);
  };

  const formatEventDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    if (!isNaN(parsedDate)) {
      return new Date(parsedDate).toISOString().split("T")[0];
    } else {
      const dateParts = dateString.split(" ");
      const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      const month = months[dateParts[0]];
      const day = dateParts[1].replace(",", "");
      const year = dateParts[2];

      return `${year}-${month.toString().padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  };

  const timeSchedule = [
    { value: "08:00:00 - 09:00:00", label: "08:00 AM - 09:00 AM" },
    { value: "09:00:00 - 10:00:00", label: "09:00 AM - 10:00 AM" },
    { value: "10:00:00 - 11:00:00", label: "10:00 AM - 11:00 AM" },
    { value: "11:00:00 - 12:00:00", label: "11:00 AM - 12:00 PM" },
    { value: "13:00:00 - 14:00:00", label: "01:00 PM - 02:00 PM" },
    { value: "14:00:00 - 15:00:00", label: "02:00 PM - 03:00 PM" },
    { value: "15:00:00 - 16:00:00", label: "03:00 PM - 04:00 PM" },
    { value: "16:00:00 - 17:00:00", label: "04:00 PM - 05:00 PM" },
  ];

  const filterTimeSlots = (date) => {
    const event = medicalCertificate.find((e) => {
      const formattedEventDate = formatEventDate(e.event_date);
      return formattedEventDate === date;
    });

    if (event) {
      const startHour = parseInt(event.event_start.split(":")[0], 10);
      const endHour = parseInt(event.event_end.split(":")[0], 10);

      const filtered = timeSchedule.filter(({ value }) => {
        const [slotStart, slotEnd] = value
          .split(" - ")
          .map((time) => parseInt(time.split(":")[0], 10));
        return slotEnd <= startHour || slotStart >= endHour;
      });
      setFilteredSlots(filtered);

      setFormData((prevFormData) => ({
        ...prevFormData,
        event_name: event.event_name,
        event_venue: event.event_venue,
        event_date: date,
        event_id: event.id,
        user_id: user.id,
      }));
    } else {
      setFilteredSlots(timeSchedule);
      setFormData({
        event_name: "",
        event_venue: "",
        event_date: date,
        event_id: "",
        user_id: "",
      });
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    filterTimeSlots(day.dateString);
  };

  const handleFormSubmit = async () => {
    if (
      !formData ||
      !formData.event_name ||
      !formData.event_venue ||
      !formData.event_date ||
      !selectedSlot
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const [startTime, endTime] = selectedSlot.split(" - ");

    try {
      const submissionData = {
        ...formData,
        event_start: startTime,
        event_end: endTime,
      };

      const response = await storeBarangayEvent(submissionData);
      console.log("store barangay event", response);
      Alert.alert("Success", "Appointment Booked");
    } catch (error) {
      console.error("Error storing appointment:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={["#001f3f", "#00509e", "#00aaff"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: "blue" },
          }}
        />

        <View style={styles.formContainer}>
          <Text style={styles.boldWhiteText}>Event Name:</Text>
          <TextInput style={styles.input} value={formData.event_name} editable={false} />

          <Text style={styles.boldWhiteText}>Event Venue:</Text>
          <TextInput style={styles.input} value={formData.event_venue} editable={false} />

          <Text style={styles.boldWhiteText}>Event Date:</Text>
          <TextInput style={styles.input} value={formData.event_date} editable={false} />

          <Text style={styles.boldWhiteText}>Time Slot:</Text>
          <Picker
            selectedValue={selectedSlot}
            onValueChange={(itemValue) => setSelectedSlot(itemValue)}
          >
            {filteredSlots.map((slot, index) => (
              <Picker.Item key={index} label={slot.label} value={slot.value} />
            ))}

          </Picker>

          <Button title="Book Appointment" onPress={handleFormSubmit} />
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, marginTop: 60 },
  formContainer: { marginTop: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  boldWhiteText: {
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    marginBottom: 5,
  },
});

export default AppointmentScreen;
