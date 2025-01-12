import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert, TextInput, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { getTopMedicine, searchMedicine } from "../services/Medicine";
import { getUpcomingBarangayEvent } from "../services/Appointment";

const PatientHomeScreen = ({ route }) => {
  const { user } = route.params;
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingBarangayEvents, setUpcomingBarangayEvents] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState({ illnesses: [], medicines: [] });
  const [filteredMedicines, setFilteredMedicines] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
      illnessesCount[record.illness] = (illnessesCount[record.illness] || 0) + 1;
      medicinesCount[record.medicine] = (medicinesCount[record.medicine] || 0) + record.total_quantity;
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

        const processedData = processDataAnalytics(dataForMonth);

        setChartData(processedData);
        setFilteredData(processedData);
        setUpcomingBarangayEvents(upcomingBarangayEvents || {});
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setLoading(false);
        setError(err.message);
        Alert.alert("Error", "Unable to fetch chart data. Please try again later.");
      }
    };
    fetchChartData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        if (searchQuery.trim() === "") {
          setFilteredMedicines([]);
          setShowDropdown(false);
          return;
        }

        const response = await searchMedicine(searchQuery);
        const medicines = response.map((item) => item.medicine_name);
        setFilteredMedicines(medicines);
        setShowDropdown(medicines.length > 0);
      } catch (error) {
        console.error("Error fetching filtered data:", error.message);
        Alert.alert("Error", "Unable to fetch filtered data. Please try again.");
      }
    };

    fetchFilteredData();
  }, [searchQuery]);

  const handleSelectMedicine = (medicine) => {
    setSearchQuery(medicine);
    setShowDropdown(false);
  };

  return (
    <LinearGradient colors={["#001f3f", "#00509e", "#00aaff"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {user ? (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search illnesses or medicines..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {showDropdown && (
              <FlatList
                data={filteredMedicines}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdown}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectMedicine(item)}>
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {upcomingBarangayEvents && (
              <View style={styles.card}>
                <Text style={styles.eventTitle}>{upcomingBarangayEvents.event_name}</Text>
                <Text style={styles.doctorText}>Dr. {upcomingBarangayEvents.doctor_name} MD</Text>
                <Text style={styles.eventDate}>{upcomingBarangayEvents.event_date}</Text>
                <Text style={styles.eventTime}>
                  {upcomingBarangayEvents.event_start} - {upcomingBarangayEvents.event_end}
                </Text>
              </View>
            )}

            {loading ? (
              <Text>Loading data...</Text>
            ) : error ? (
              <Text style={styles.errorText}>Failed to load data.</Text>
            ) : (
              <>
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Top Illnesses</Text>
                  <BarChart
                    data={{
                      labels: filteredData.illnesses?.labels || [],
                      datasets: [
                        {
                          data: filteredData.illnesses?.data || [],
                          color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                          strokeWidth: 2,
                        },
                      ],
                    }}
                    width={350}
                    height={220}
                    fromZero
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                    }}
                    style={styles.chart}
                  />
                </View>

                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Top Medicines</Text>
                  <BarChart
                    data={{
                      labels: filteredData.medicines?.labels || [],
                      datasets: [
                        {
                          data: filteredData.medicines?.data || [],
                          color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                          strokeWidth: 2,
                        },
                      ],
                    }}
                    width={350}
                    height={220}
                    fromZero
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                    }}
                    style={styles.chart}
                  />
                </View>
              </>
            )}
          </ScrollView>
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
  },
  safeArea: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    maxWidth: 400,
    flexShrink: 1,
    textAlign: "center",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001f3f",
  },
  doctorText: {
    fontSize: 16,
    color: "#475569",
  },
  eventDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
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
  },
  chart: {
    borderRadius: 16,
  },
});

export default PatientHomeScreen;
