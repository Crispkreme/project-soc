import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserDetails, updateUserDetails } from "../services/AuthService";

const UpdateProfileScreen = ({ route }) => {
  const { user } = route.params || {};

  if (!user) {
    Alert.alert("Error", "User data is missing!");
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    birthday: new Date(),
    civil_status: "",
    religion: "",
    status: "Active",
    address: "",
    profile: null,
  });

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserDetails(user.id);

      if (data && data.details) {
        const { details } = data;

        // Populate formData with user details
        setFormData({
          firstname: details.firstname || "",
          middlename: details.middlename || "",
          lastname: details.lastname || "",
          gender: details.gender || "",
          birthday: details.birthday ? new Date(details.birthday) : new Date(),
          civil_status: details.civil_status || "",
          religion: details.religion || "",
          status: details.status || "Active",
          address: details.address || "",
          profile: details.profile || null,
        });
      } else {
        console.warn("User details are empty or invalid.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err.response || err.message);
      setError("Failed to fetch user data. Please try again.");
      Alert.alert("Error", "Failed to fetch user data. Please try again.");
      setLoading(false);
    }
  };

  // Initialize user details
  useEffect(() => {
    if (user.id) {
      fetchUserData();
    }
  }, [user.id]);

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date picker change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.birthday;
    setShowDatePicker(false);
    setFormData((prev) => ({ ...prev, birthday: currentDate }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const formattedBirthday = formData.birthday.toISOString().split("T")[0];
  
      const formDataToSubmit = {
        ...formData,
        user_id: user.id,
        birthday: formattedBirthday,
      };
  
      console.log("Submitting form data:", formDataToSubmit);
  
      const response = await updateUserDetails(formDataToSubmit);
  
      if (response && response.details) {
        Alert.alert("Profile Updated", "Your profile has been updated successfully.");
      } else {
        throw new Error("Profile update failed.");
      }
  
      setLoading(false);
    } catch (err) {
      console.error("Error submitting form:", err.message || err);
      setLoading(false);
      Alert.alert("Error", "Unable to update profile. Please try again.");
    }
  };  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.firstname}
        onChangeText={(text) => handleInputChange("firstname", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Middle Name"
        value={formData.middlename}
        onChangeText={(text) => handleInputChange("middlename", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lastname}
        onChangeText={(text) => handleInputChange("lastname", text)}
      />

      <Picker
        selectedValue={formData.gender}
        onValueChange={(itemValue) => handleInputChange("gender", itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerText}>
          {formData.birthday
            ? formData.birthday.toDateString()
            : "Select Birthday"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Picker
        selectedValue={formData.civil_status}
        onValueChange={(itemValue) =>
          handleInputChange("civil_status", itemValue)
        }
        style={styles.picker}
      >
        <Picker.Item label="Select Civil Status" value="" />
        <Picker.Item label="Single" value="Single" />
        <Picker.Item label="Married" value="Married" />
        <Picker.Item label="Divorced" value="Divorced" />
        <Picker.Item label="Separated" value="Separated" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Religion"
        value={formData.religion}
        onChangeText={(text) => handleInputChange("religion", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange("address", text)}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  picker: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  datePickerText: {
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateProfileScreen;
