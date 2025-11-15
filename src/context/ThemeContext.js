// Context: Theme Context
// Maneja el estado del tema claro/oscuro de la aplicación

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  colors: {
    primary: '#ff8c42',        // naranja principal vibrante
    secondary: '#ffa867',      // naranja más suave
    background: '#fff7f2',     // fondo muy claro cálido
    card: '#ffffff',
    text: '#2c2c2c',           // texto oscuro para contraste
    textSecondary: '#6b6b6b',
    border: '#ffd8b8',         // borde naranja muy claro
    error: '#e05353',
    success: '#4caf50',
    warning: '#ff9d42',
    cardBackground: '#fff3e7',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: false,
};

export const darkTheme = {
  colors: {
    primary: '#ff8c42',        // mismo naranja principal para consistencia
    secondary: '#ffb57a',      // naranja suave para tonos secundarios
    background: '#1a1a1a',
    card: '#262626',
    text: '#f5f5f5',
    textSecondary: '#cfcfcf',
    border: '#ff7a1f',         // borde naranja profundo
    error: '#ff6b6b',
    success: '#63e06d',
    warning: '#ff9d42',
    cardBackground: '#2e2e2e',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  dark: true,
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia de tema al iniciar
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error al cargar preferencia de tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error al guardar preferencia de tema:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
