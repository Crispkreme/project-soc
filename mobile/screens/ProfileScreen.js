import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Alert, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from "../services/AuthService";

const ProfileScreen = ({ route }) => {
  const { user } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserDetails(user.id);
      console.log('data', data);
      setUserDetails(data.details || {});
      setLoading(false);
    } catch (err) {
      console.error("Axios error:", err.response || err.message);
      setLoading(false);
      setError("Something went wrong. Please try again.");
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchUserData();
    }
  }, [user.id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: userDetails?.profilePicture || "https://randomuser.me/api/portraits/women/79.jpg" }}
          style={styles.round}
        />
        <Text style={styles.name}>
          {userDetails?.firstname || "First"} {userDetails?.middlename || "Middle"} {userDetails?.lastname || "Patient"}
        </Text>
        <Text style={styles.location}>Patient</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('AccountDetailScreen', { user: user })}
          >
            <Text style={styles.buttonText}>Account Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('UpdateProfileScreen', { user: user })}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('ChangeEmailScreen', { user: user })}
          >
            <Text style={styles.buttonText}>Change Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('ChangePasswordScreen', { params: user })}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('DeactivateAccountScreen', { params: user })}
          >
            <Text style={styles.buttonText}>Deactivate Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f4f4f4",
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  round: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginVertical: 5,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "column", 
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00BFFF",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  skills: {
    marginTop: 10,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ProfileScreen;
