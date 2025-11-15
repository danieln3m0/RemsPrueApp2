/**
 * AppNavigation - Configuración de navegación de la aplicación
 * 
 * Define la estructura de navegación utilizando React Navigation v6.
 * Combina Bottom Tab Navigator (3 tabs principales) con Stack Navigator
 * (para navegación entre Lista y Edición de tableros).
 * Incluye soporte para tema dinámico y estilos personalizados para tabs.
 * 
 * @module navigation/AppNavigation
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

// Importar vistas
import HomeView from '../views/HomeView';
import TablerosListView from '../views/TablerosListView';
import CreateTableroView from '../views/CreateTableroView';
import EditTableroView from '../views/EditTableroView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Stack Navigator para la sección de Tableros
 * 
 * Contiene dos pantallas:
 * 1. Tableros - Lista completa con opciones CRUD
 * 2. EditTablero - Formulario de edición (recibe tablero por parámetros)
 * 
 * Los headers se ocultan porque cada vista maneja su propio header personalizado.
 * 
 * @function
 * @returns {React.Component} Stack Navigator con pantallas de tableros
 */
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

/**
 * Componente principal de navegación de la aplicación
 * 
 * Bottom Tab Navigator con 3 tabs principales:
 * 1. Inicio - Perfil del candidato (HomeView)
 * 2. Dashboard - Lista y edición de tableros (TablerosStack)
 * 3. Crear - Formulario de creación (CreateTableroView)
 * 
 * Características:
 * - Iconos animados con fondo circular al estar activos
 * - Indicador de gota (drop indicator) debajo del tab activo
 * - Tema dinámico con colores adaptativos para modo claro/oscuro
 * - Estilos personalizados para cada estado (focused/unfocused)
 * - Height adaptativo con paddingBottom para dispositivos con notch
 * - SafeAreaProvider para manejo seguro de áreas del dispositivo
 * 
 * @function
 * @returns {React.Component} NavigationContainer con Bottom Tab Navigator
 */
function AppNavigation() {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <SafeAreaProvider>
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

            return (
              <View style={tabStyles.tabIconContainer}>
                <View style={[
                  tabStyles.iconWrapper,
                  focused && tabStyles.iconWrapperFocused,
                  { backgroundColor: focused ? (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)') : 'transparent' }
                ]}>
                  <Ionicons name={iconName} size={size} color={color} />
                </View>
                {focused && (
                  <View style={[tabStyles.dropIndicator, { backgroundColor: color }]} />
                )}
              </View>
            );
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingBottom: 12,
            paddingTop: 8,
            height: 'auto',
            minHeight: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            paddingBottom: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  flagIcon: {
    fontSize: 26,
  },
});

const tabStyles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
  },
  iconWrapperFocused: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AppNavigation;
