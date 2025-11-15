// Navigation: App Navigation
// Configura la navegación con Bottom Tabs y Stack Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importar vistas
import HomeView from '../views/HomeView';
import TablerosListView from '../views/TablerosListView';
import CreateTableroView from '../views/CreateTableroView';
import EditTableroView from '../views/EditTableroView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator para la sección de Tableros (incluye Lista y Edición)
function TablerosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Tableros" 
        component={TablerosListView}
        options={{ title: 'Lista de Tableros' }}
      />
      <Stack.Screen 
        name="EditTablero" 
        component={EditTableroView}
        options={{ title: 'Editar Tablero' }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Crear') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#8492a6',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e8ecef',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen 
          name="Inicio" 
          component={HomeView}
          options={{
            title: 'Inicio',
            tabBarLabel: 'Inicio',
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={TablerosStack}
          options={{
            title: 'Tableros',
            tabBarLabel: 'Tableros',
          }}
        />
        <Tab.Screen 
          name="Crear" 
          component={CreateTableroView}
          options={{
            title: 'Crear',
            tabBarLabel: 'Crear',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
