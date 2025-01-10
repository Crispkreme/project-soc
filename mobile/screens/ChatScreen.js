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
import { getAllDoctor } from "../services/Doctor";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [doctor, setDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const doctorData = await getAllDoctor(user.id);
        setDoctor(doctorData?.doctor || []);
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

    fetchDoctorData();
  }, [user.id]);

  // Format the doctor's birthday
  const formatDate = (date) => {
    return moment(date, "MMMM D, YYYY").isValid() ? moment(date).format("MMM DD, YYYY") : "Invalid Date";
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
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
        colors={['#6a11cb', '#2575fc']}
        style={styles.container}
      >
        <Text style={styles.error}>{error}</Text>
      </LinearGradient>
    );
  }

  const handleDoctorClick = (doctorData) => {
    if (!doctorData || !user) {
      console.error("Invalid doctor or user data:", { doctorData, user });
      return;
    }
  
    navigation.navigate("MessageBoxScreen", { doctor: doctorData, user: user });
  };
  

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          <Text style={styles.headerText}>Doctor Information</Text>

          {doctor.length > 0 ? (
            doctor.map((item) => (
              <View
                key={item.id}
                style={styles.card}
                onStartShouldSetResponder={() => handleDoctorClick(item)}
              >
                <Text style={styles.name}>Name: {item.name}</Text>
                <Text style={styles.role}>Role: {item.role}</Text>
                <Text style={styles.age}>Age: {item.age}</Text>
                <Text style={styles.gender}>Gender: {item.gender}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.birthday}>Birthday: {formatDate(item.birthday)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No doctor data available.</Text>
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
    color: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  role: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  age: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  gender: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  status: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  birthday: {
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

export default ChatScreen;
