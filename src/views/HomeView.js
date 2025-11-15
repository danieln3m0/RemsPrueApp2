// View: Home Screen
// Pantalla inicial que muestra la información del candidato

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CandidateController from '../controllers/CandidateController';

const HomeView = () => {
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    // Obtener datos del candidato a través del controlador
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con gradiente */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color="#667eea" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Mi Perfil Profesional</Text>
        </LinearGradient>

        {/* Tarjeta de información principal */}
        <View style={styles.card}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="person-circle-outline" size={24} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nombre Completo</Text>
                <Text style={styles.infoValue}>{candidateData.fullName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={24} color="#667eea" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{candidateData.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tarjeta de descripción profesional */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>¿Por qué contratarme?</Text>
          </View>
          <Text style={styles.description}>{candidateData.profileDescription}</Text>
        </View>

        {/* Tarjeta de habilidades */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
          </View>
          <View style={styles.skillsContainer}>
            {candidateData.skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desarrollado con React Native & Expo
          </Text>
          <Text style={styles.footerSubtext}>
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
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
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
