import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./contexts/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import PatientHomeScreen from "./screens/PatientHomeScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator({ route }) {
  const user = route?.params?.user;

  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen 
        name="Dashboard" 
        component={PatientHomeScreen} 
        initialParams={{ user }}
        options={{ headerShown: false }}
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
            name="Dashboard"
            component={DrawerNavigator} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
