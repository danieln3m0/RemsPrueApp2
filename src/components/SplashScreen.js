/**
 * SplashScreen - Pantalla de carga inicial animada
 * 
 * Componente que se muestra al iniciar la aplicación durante 2.5 segundos.
 * Incluye múltiples animaciones paralelas: fade, scale, y rotate.
 * Al completarse, ejecuta el callback onFinish para continuar a la app principal.
 * 
 * @component
 * @module components/SplashScreen
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onFinish - Callback que se ejecuta al terminar las animaciones
 * 
 * @returns {React.Component} Pantalla de carga con animaciones
 * 
 * @example
 * <SplashScreen onFinish={() => setIsLoading(false)} />
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** @const Dimensiones de la ventana para cálculos responsivos */
const { width, height } = Dimensions.get('window');

/**
 * Componente funcional de SplashScreen
 * 
 * Animaciones implementadas:
 * - fadeAnim: Opacidad de 0 a 1 (fade in) y luego de 1 a 0 (fade out)
 * - scaleAnim: Escala de 0.3 a 1 con efecto spring, luego a 0.8
 * - rotateAnim: Rotación de 0 a 360 grados
 * 
 * Duración total: 2.5 segundos
 * 
 * @function
 */
const SplashScreen = ({ onFinish }) => {
  /** @type {Animated.Value} Animación de opacidad (fade in/out) */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  /** @type {Animated.Value} Animación de escala (zoom effect) */
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  /** @type {Animated.Value} Animación de rotación (spin effect) */
  const rotateAnim = useRef(new Animated.Value(0)).current;

  /**
   * Efecto que ejecuta las animaciones al montar el componente
   * 
   * Secuencia de animaciones:
   * 1. Animación de entrada paralela (fade, scale spring, rotate) - 1 segundo
   * 2. Espera de 2.5 segundos mostrando el contenido
   * 3. Animación de salida paralela (fade out, scale down) - 500ms
   * 4. Ejecuta onFinish callback
   * 
   * useNativeDriver: true para mejor rendimiento (60fps)
   */
  useEffect(() => {
    // Fase 1: Animaciones de entrada paralelas
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Fase 2: Esperar 2.5 segundos y ejecutar animaciones de salida
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    // Cleanup: cancelar timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  /**
   * Interpolación para convertir rotateAnim (0 a 1) en grados (0deg a 360deg)
   * Aplicada al icono de rayo para efecto de rotación completa
   * 
   * @const
   */
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="flash" size={80} color="#a44a00ff" />
        </Animated.View>
        
        <Text style={styles.title}>Tableros Eléctricos</Text>
        <Text style={styles.subtitle}>Sistema de Gestión</Text>
        
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  transform: [{
                    scaleX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        Powered by Francis D.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#783800ff',
  },
  loadingContainer: {
    marginTop: 50,
    width: width * 0.6,
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(237, 172, 110, 1)',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#803700ff',
    transformOrigin: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    fontSize: 12,
    letterSpacing: 1,
    color: '#a69884ff',
  },
});

export default SplashScreen;
