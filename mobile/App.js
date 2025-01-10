import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthProvider } from "./contexts/AuthContext";

import PatientHomeScreen from "./screens/PatientHomeScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import PatientRecordScreen from "./screens/PatientRecordScreen";
import MedicalRecordScreen from "./screens/MedicalRecordScreen";
import MedicineRequesterScreen from "./screens/MedicineRequesterScreen";
import MedicalCertificateScreen from "./screens/MedicalCertificateScreen";
import MedicineAvailableScreen from "./screens/MedicineAvailableScreen";
import ScheduleConsultationScreen from "./screens/ScheduleConsultationScreen";
import BhwActivityScreen from "./screens/BhwActivityScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MessageBoxScreen from "./screens/MessageBoxScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import AccountDetailScreen from "./screens/AccountDetailScreen";
import ChangeEmailScreen from "./screens/ChangeEmailScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import DeactivateAccountScreen from "./screens/DeactivateAccountScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator({ route }) {
  const { user } = route?.params || {};
  const navigation = useNavigation();

  if (!user) {
    navigation.replace("Login");
    return null;
  }

  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen
        name="Dashboard"
        component={PatientHomeScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Appointment"
        component={AppointmentScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-check"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Patient History"
        component={PatientRecordScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Medical History"
        component={MedicalRecordScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="medical-bag"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Medical Requester"
        component={MedicineRequesterScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="medical-bag"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Medical Certificate"
        component={MedicalCertificateScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="certificate"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Medicine Available"
        component={MedicineAvailableScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Schedule Consultation"
        component={ScheduleConsultationScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Bhw Activity"
        component={BhwActivityScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Messages"
        component={ChatScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Profile Settings"
        component={ProfileScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="gear"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="MessageBoxScreen" component={MessageBoxScreen} options={{ headerShown: false }}/>
          <Stack.Screen
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountDetailScreen"
            component={AccountDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangeEmailScreen"
            component={ChangeEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeactivateAccountScreen"
            component={DeactivateAccountScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// Styles for ProfileScreen and drawer icon
const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 14,
    color: "gray",
  },
});
