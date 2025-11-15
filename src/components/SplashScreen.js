// Splash Screen
// Pantalla de carga inicial con animaciones

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
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

    // Esperar 2.5 segundos y luego terminar
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

    return () => clearTimeout(timer);
  }, []);

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
          <Ionicons name="flash" size={80} color="#667eea" />
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
        Powered by Francis D. Nemocón
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
    color: '#667eea',
  },
  loadingContainer: {
    marginTop: 50,
    width: width * 0.6,
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#667eea',
    transformOrigin: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    fontSize: 12,
    letterSpacing: 1,
    color: '#8492a6',
  },
});

export default SplashScreen;
