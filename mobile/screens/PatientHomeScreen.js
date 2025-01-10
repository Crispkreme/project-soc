import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { getTopMedicine } from "../services/Medicine";
import { getUpcomingBarangayEvent } from "../services/Appointment";

const PatientHomeScreen = ({ route }) => {
  
  const { user } = route.params;
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingBarangayEvents, setUpcomingBarangayEvents] = useState([]);

  const processDataAnalytics = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        illnesses: { labels: ["No data available"], data: [0] },
        medicines: { labels: ["No data available"], data: [0] },
      };
    }

    const illnessesCount = {};
    const medicinesCount = {};

    data.forEach((record) => {
      illnessesCount[record.illness] =
        (illnessesCount[record.illness] || 0) + 1;
      medicinesCount[record.medicine] =
        (medicinesCount[record.medicine] || 0) + record.total_quantity;
    });

    const sortedIllnesses = Object.entries(illnessesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const sortedMedicines = Object.entries(medicinesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      illnesses: {
        labels: sortedIllnesses.map((item) => item[0]),
        data: sortedIllnesses.map((item) => item[1]),
      },
      medicines: {
        labels: sortedMedicines.map((item) => item[0]),
        data: sortedMedicines.map((item) => item[1]),
      },
    };
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const [medicineData, barangayData] = await Promise.all([
          getTopMedicine(),
          getUpcomingBarangayEvent(),
        ]);

        const { dataAnalytic } = medicineData;
        const { upcomingBarangayEvents } = barangayData;

        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const dataForMonth = dataAnalytic[currentMonth] || [];

        setChartData(processDataAnalytics(dataForMonth));
        setUpcomingBarangayEvents(upcomingBarangayEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setLoading(false);
        setError(err.message);
        Alert.alert(
          "Error",
          "Unable to fetch chart data. Please try again later."
        );
      }
    };
    fetchChartData();
  }, []);

  const illnessDataForChart = {
    labels: chartData.illnesses?.labels || [],
    datasets: [
      {
        data: chartData.illnesses?.data || [],
        color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy blue bars
        strokeWidth: 2,
      },
    ],
  };

  const medicineDataForChart = {
    labels: chartData.medicines?.labels || [],
    datasets: [
      {
        data: chartData.medicines?.data || [],
        color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy blue bars
        strokeWidth: 2,
      },
    ],
  };

  return (
    <LinearGradient
      colors={["#001f3f", "#00509e", "#00aaff"]} // Gradient colors
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {user ? (
          <>
            <View style={styles.card}>
              <Text style={styles.eventTitle}>
                {upcomingBarangayEvents.event_name}
              </Text>
              <Text style={styles.doctorText}>
                Dr. {upcomingBarangayEvents.doctor_name} MD
              </Text>
              <Text style={styles.eventDate}>
                {upcomingBarangayEvents.event_date}
              </Text>
              <Text style={styles.eventTime}>
                {upcomingBarangayEvents.event_start} -{" "}
                {upcomingBarangayEvents.event_end}
              </Text>
            </View>

            {loading ? (
              <Text>Loading data...</Text>
            ) : error ? (
              <Text style={styles.errorText}>Failed to load data.</Text>
            ) : (
              <>
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Top Illnesses</Text>
                  <BarChart
                    data={illnessDataForChart}
                    width={350}
                    height={220}
                    fromZero
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff", // White background
                      backgroundGradientTo: "#ffffff", // White background
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy bars
                      labelColor: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy labels
                    }}
                    style={styles.chart}
                  />
                </View>

                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Top Medicines</Text>
                  <BarChart
                    data={medicineDataForChart}
                    width={350}
                    height={220}
                    fromZero
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff", // White background
                      backgroundGradientTo: "#ffffff", // White background
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy bars
                      labelColor: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Navy labels
                    }}
                    style={styles.chart}
                  />
                </View>
              </>
            )}
          </>
        ) : (
          <Text style={styles.text}>No user information available</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001f3f",
    marginBottom: 6,
  },
  doctorText: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#64748b",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});

export default PatientHomeScreen;
