import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getTopMedicine } from "../services/Medicine";
import { getUpcomingBarangayEvent } from "../services/Appointment";

const PatientHomeScreen = ({ route }) => {
  const { user } = route.params;
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingBarangayEvents, setUpcomingBarangayEvents] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const processDataAnalytics = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data provided.");
      return {
        illnesses: {
          labels: ["No data available"],
          data: [0],
        },
        medicines: {
          labels: ["No data available"],
          data: [0],
        },
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
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  const medicineDataForChart = {
    labels: chartData.medicines?.labels || [],
    datasets: [
      {
        data: chartData.medicines?.data || [],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>{upcomingBarangayEvents.event_name}</Text>
          <Text style={styles.subText}>Dr. {upcomingBarangayEvents.doctor_name} MD</Text>
          <Text style={styles.subText}>{upcomingBarangayEvents.event_date}</Text>
          <Text style={styles.subText}>{upcomingBarangayEvents.event_start} - {upcomingBarangayEvents.event_end}</Text>

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
                    backgroundGradientFrom: "#f4f4f4",
                    backgroundGradientTo: "#e1e1e1",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                    backgroundGradientFrom: "#f4f4f4",
                    backgroundGradientTo: "#e1e1e1",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#334155",
  },
  subText: {
    fontSize: 16,
    color: "#334155",
    marginTop: 5,
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
    color: "#334155",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});

export default PatientHomeScreen;
