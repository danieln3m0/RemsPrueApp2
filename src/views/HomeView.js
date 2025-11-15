/**
 * HomeView - Vista principal del perfil del candidato
 * 
 * Vista 1: Pantalla inicial que muestra la información profesional del candidato,
 * incluyendo datos personales, descripción profesional y habilidades técnicas.
 * Incluye funcionalidad de cambio de tema (modo claro/oscuro) con persistencia.
 * 
 * @component
 * @module views/HomeView
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 * 
 * @returns {React.Component} Componente de vista del perfil del candidato
 * 
 * @example
 * // Uso en navegación
 * <Tab.Screen name="Inicio" component={HomeView} />
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CandidateController from '../controllers/CandidateController';
import { useTheme } from '../context/ThemeContext';

/**
 * Componente funcional que renderiza el perfil del candidato
 * 
 * Características:
 * - Obtiene datos del candidato a través del CandidateController
 * - Soporta tema dinámico (claro/oscuro) mediante ThemeContext
 * - Muestra avatar, información personal, descripción profesional y habilidades
 * - Header con gradiente personalizado y botón de cambio de tema
 * - Layout responsivo con ScrollView para contenido extenso
 * 
 * @function
 */
const HomeView = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [candidateData, setCandidateData] = useState(null);

  /**
   * Efecto que carga los datos del candidato al montar el componente
   * Utiliza el patrón MVC a través del CandidateController
   */
  useEffect(() => {
    const data = CandidateController.getCandidateInfo();
    setCandidateData(data);
  }, []);

  if (!candidateData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con gradiente */}
        <LinearGradient
          colors={isDarkMode ? ['#8c3f00', '#a14a00'] : ['#a65300ff', '#984200ff']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.themeToggle}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color="#514100ff" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Mi Perfil Profesional</Text>
        </LinearGradient>

        {}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Nombre Completo</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{candidateData.fullName}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Correo Electrónico</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{candidateData.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tarjeta de descripción profesional */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>¿Por qué contratarme?</Text>
          </View>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{candidateData.profileDescription}</Text>
        </View>

        {/* Tarjeta de habilidades */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Habilidades Técnicas</Text>
          </View>
          <View style={styles.skillsContainer}>
            {candidateData.skills.map((skill, index) => (
              <View key={index} style={[styles.skillChip, { 
                backgroundColor: isDarkMode ? theme.colors.cardBackground : '#edf2f7',
                borderColor: theme.colors.border 
              }]}>
                <Text style={[styles.skillText, { color: theme.colors.primary }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Desarrollado con React Native & Expo
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.colors.textSecondary }]}>
            Arquitectura MVC
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoSection: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8492a6',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8ecef',
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 24,
    textAlign: 'justify',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillChip: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  skillText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#8492a6',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 4,
  },
});

export default HomeView;
