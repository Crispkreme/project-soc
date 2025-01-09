import React, { useContext } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Add this import
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PatientHomeScreen from "./screens/PatientHomeScreen";
import PatientRecordScreen from "./screens/PatientRecordScreen";
import MedicalRecordScreen from "./screens/MedicalRecordScreen";
import MedicalCertificateScreen from "./screens/MedicalCertificateScreen";
import MedicineAvailableScreen from "./screens/MedicineAvailableScreen";
import ScheduleConsultationScreen from "./screens/ScheduleConsultationScreen";
import BhwActivityScreen from "./screens/BhwActivityScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import MedicineRequesterScreen from "./screens/MedicineRequesterScreen";
import ChatScreen from "./screens/ChatScreen";
import MessageBoxScreen from "./screens/MessageBox";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator({ route }) {
  const { logout } = useContext(AuthContext);
  const user = route?.params?.user;
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen
        name="Dashboard"
        component={PatientHomeScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
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
            <Icon name="calendar-check" color={color} size={size} />
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
            <Icon name="file-document-outline" color={color} size={size} />
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
            <Icon name="medical-bag" color={color} size={size} />
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
            <Icon name="medical-bag" color={color} size={size} />
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
            <Icon name="certificate" color={color} size={size} />
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
            <Icon name="pill" color={color} size={size} />
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
            <Icon name="calendar-clock" color={color} size={size} />
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
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={ChatScreen}
        initialParams={{ user }}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Icon name="message" color={color} size={size} />
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
          <Stack.Screen name="MessageBoxScreen" component={MessageBoxScreen} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
