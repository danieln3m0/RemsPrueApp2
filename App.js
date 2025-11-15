/**
 * App - Componente raíz de la aplicación
 * 
 * Punto de entrada principal que configura los providers necesarios:
 * 1. QueryClientProvider - Para React Query (gestión de estado asíncrono)
 * 2. ThemeProvider - Para Context API de temas (modo claro/oscuro)
 * 3. AppNavigation - Sistema de navegación con tabs y stacks
 * 
 * Muestra SplashScreen durante 2.5 segundos antes de cargar la app principal.
 * 
 * @module App
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';
import SplashScreen from './src/components/SplashScreen';
import { ThemeProvider } from './src/context/ThemeContext';

/**
 * Instancia global de QueryClient para React Query
 * 
 * Configuración:
 * - retry: 2 intentos en caso de error en queries
 * - refetchOnWindowFocus: false (no refrescar automáticamente al enfocar ventana)
 * 
 * Esta configuración se aplica a todas las queries y mutations de la app
 * a menos que se sobrescriba en queries específicas.
 * 
 * @const
 * @type {QueryClient}
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Componente wrapper que maneja SafeAreaView para toda la aplicación
 * Aplica los insets necesarios para APK en dispositivos reales
 * 
 * @function
 * @returns {React.Component} App envuelta en SafeAreaView con insets apropiados
 */
function SafeWrapper() {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        paddingBottom: insets.bottom 
      }}
      edges={['top']}
    >
      <AppNavigation />
    </SafeAreaView>
  );
}

/**
 * Componente raíz de la aplicación
 * 
 * Flujo de ejecución:
 * 1. Muestra SplashScreen durante isLoading = true (2.5 segundos)
 * 2. Oculta SplashScreen y muestra la app principal
 * 3. Envuelve la app en providers para SafeArea, React Query y Theme
 * 4. SafeWrapper maneja las áreas seguras para APK
 * 
 * Orden de providers (de afuera hacia adentro):
 * SafeAreaProvider > QueryClientProvider > ThemeProvider > SafeWrapper > AppNavigation
 * 
 * @function
 * @returns {React.Component} Aplicación completa con providers y navegación
 */
export default function App() {
  /** @type {boolean} Estado de carga para controlar SplashScreen */
  const [isLoading, setIsLoading] = useState(true);

  // Fase de carga: mostrar SplashScreen
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setIsLoading(false)} />
      </SafeAreaProvider>
    );
  }

  // Fase principal: app completa con providers anidados y SafeArea
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SafeWrapper />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
