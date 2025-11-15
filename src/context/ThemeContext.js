/**
 * ThemeContext - Context API para gestión de temas de la aplicación
 * 
 * Proporciona un sistema de temas (claro/oscuro) global con persistencia.
 * Utiliza AsyncStorage para guardar la preferencia del usuario.
 * Todos los componentes pueden acceder al tema actual y alternar entre modos.
 * 
 * @module context/ThemeContext
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Context para almacenar el estado del tema
 * @type {React.Context}
 */
const ThemeContext = createContext();

/**
 * Hook personalizado para acceder al contexto de tema
 * 
 * Proporciona acceso al tema actual, estado del modo oscuro, y función toggle.
 * Debe ser usado dentro de un componente envuelto por ThemeProvider.
 * 
 * @function
 * @returns {Object} Objeto con propiedades del tema
 * @returns {Object} returns.theme - Objeto de tema actual (lightTheme o darkTheme)
 * @returns {boolean} returns.isDarkMode - Indica si el modo oscuro está activo
 * @returns {Function} returns.toggleTheme - Función para alternar entre temas
 * @returns {boolean} returns.isLoading - Indica si aún se está cargando la preferencia
 * @throws {Error} Si se usa fuera de ThemeProvider
 * 
 * @example
 * const { theme, isDarkMode, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

/**
 * Tema claro con paleta de colores naranja cálida
 * 
 * Diseñado para alta legibilidad con fondos claros y texto oscuro.
 * Utiliza tonos naranjas vibrantes para elementos interactivos.
 * 
 * @constant
 * @type {Object}
 * @property {Object} colors - Paleta de colores del tema claro
 * @property {string} colors.primary - Color primario naranja vibrante (#ff8c42)
 * @property {string} colors.secondary - Color secundario naranja suave (#ffa867)
 * @property {string} colors.background - Fondo cálido muy claro (#fff7f2)
 * @property {string} colors.card - Color de tarjetas blanco puro (#ffffff)
 * @property {string} colors.text - Texto principal oscuro (#2c2c2c)
 * @property {string} colors.textSecondary - Texto secundario gris (#6b6b6b)
 * @property {string} colors.border - Bordes naranja muy claro (#ffd8b8)
 * @property {string} colors.error - Color de errores rojo (#e05353)
 * @property {string} colors.success - Color de éxito verde (#4caf50)
 * @property {string} colors.warning - Color de advertencia naranja (#ff9d42)
 * @property {string} colors.cardBackground - Fondo de tarjetas (#fff3e7)
 * @property {string} colors.shadow - Sombra con transparencia rgba(0, 0, 0, 0.1)
 * @property {boolean} dark - false (indica que es tema claro)
 */
export const lightTheme = {
  colors: {
    primary: '#ff8c42',
    secondary: '#ffa867',
    background: '#fff7f2',
    card: '#ffffff',
    text: '#2c2c2c',
    textSecondary: '#6b6b6b',
    border: '#ffd8b8',
    error: '#e05353',
    success: '#4caf50',
    warning: '#ff9d42',
    cardBackground: '#fff3e7',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: false,
};

/**
 * Tema oscuro con paleta de colores naranja sobre fondos oscuros
 * 
 * Optimizado para uso en ambientes con poca luz, reduce fatiga visual.
 * Mantiene el naranja como color primario para consistencia de marca.
 * 
 * @constant
 * @type {Object}
 * @property {Object} colors - Paleta de colores del tema oscuro
 * @property {string} colors.primary - Color primario naranja consistente (#ff8c42)
 * @property {string} colors.secondary - Color secundario naranja claro (#ffb57a)
 * @property {string} colors.background - Fondo oscuro (#1a1a1a)
 * @property {string} colors.card - Color de tarjetas gris oscuro (#262626)
 * @property {string} colors.text - Texto principal claro (#f5f5f5)
 * @property {string} colors.textSecondary - Texto secundario gris claro (#cfcfcf)
 * @property {string} colors.border - Bordes naranja profundo (#ff7a1f)
 * @property {string} colors.error - Color de errores rojo claro (#ff6b6b)
 * @property {string} colors.success - Color de éxito verde claro (#63e06d)
 * @property {string} colors.warning - Color de advertencia naranja (#ff9d42)
 * @property {string} colors.cardBackground - Fondo de tarjetas (#2e2e2e)
 * @property {string} colors.shadow - Sombra con transparencia rgba(0, 0, 0, 0.3)
 * @property {boolean} dark - true (indica que es tema oscuro)
 */
export const darkTheme = {
  colors: {
    primary: '#ff8c42',
    secondary: '#ffb57a',
    background: '#1a1a1a',
    card: '#262626',
    text: '#f5f5f5',
    textSecondary: '#cfcfcf',
    border: '#ff7a1f',
    error: '#ff6b6b',
    success: '#63e06d',
    warning: '#ff9d42',
    cardBackground: '#2e2e2e',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  dark: true,
};

/**
 * Provider que envuelve la aplicación para proporcionar acceso al tema
 * 
 * Características:
 * - Carga la preferencia de tema desde AsyncStorage al iniciar
 * - Proporciona función toggleTheme para alternar entre modos
 * - Persiste la preferencia del usuario automáticamente
 * - Maneja estados de carga (isLoading)
 * - Proporciona el objeto de tema completo (lightTheme o darkTheme)
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al tema
 * @returns {React.Component} Provider del contexto de tema
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider = ({ children }) => {
  /** @type {boolean} Estado del modo oscuro */
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  /** @type {boolean} Estado de carga de la preferencia desde AsyncStorage */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Efecto que carga la preferencia de tema al montar el componente
   * Se ejecuta una sola vez al iniciar la aplicación
   */
  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * Carga la preferencia de tema desde AsyncStorage
   * Si no existe preferencia guardada, usa el tema claro por defecto
   * 
   * @async
   * @function
   */
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

  /**
   * Alterna entre tema claro y oscuro
   * Guarda la nueva preferencia en AsyncStorage automáticamente
   * 
   * @async
   * @function
   */
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
