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
 * Componente raíz de la aplicación
 * 
 * Flujo de ejecución:
 * 1. Muestra SplashScreen durante isLoading = true (2.5 segundos)
 * 2. Oculta SplashScreen y muestra la app principal
 * 3. Envuelve la app en providers para React Query y Theme
 * 
 * Orden de providers (de afuera hacia adentro):
 * QueryClientProvider > ThemeProvider > AppNavigation
 * 
 * @function
 * @returns {React.Component} Aplicación completa con providers y navegación
 */
export default function App() {
  /** @type {boolean} Estado de carga para controlar SplashScreen */
  const [isLoading, setIsLoading] = useState(true);

  // Fase de carga: mostrar SplashScreen
  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  // Fase principal: app completa con providers anidados
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
