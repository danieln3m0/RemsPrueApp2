// View: Formulario de Creación de Tablero
// Vista 3: Formulario para crear un nuevo tablero eléctrico

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TableroController from '../controllers/TableroController';

const CreateTableroView = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    marca: '',
    capacidad_amperios: '',
    ano_fabricacion: new Date().getFullYear().toString(),
    ano_instalacion: new Date().getFullYear().toString(),
    estado: 'Operativo',
  });

  const estadoOptions = ['Operativo', 'Mantenimiento', 'Fuera de servicio'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    
    if (!formData.ubicacion.trim()) {
      Alert.alert('Error', 'La ubicación es requerida');
      return;
    }

    if (!formData.marca.trim()) {
      Alert.alert('Error', 'La marca es requerida');
      return;
    }

    if (!formData.capacidad_amperios || isNaN(formData.capacidad_amperios)) {
      Alert.alert('Error', 'La capacidad debe ser un número válido');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        capacidad_amperios: parseInt(formData.capacidad_amperios),
        ano_fabricacion: parseInt(formData.ano_fabricacion),
        ano_instalacion: parseInt(formData.ano_instalacion),
      };

      const result = await TableroController.createTablero(dataToSend);

      if (result.success) {
        Alert.alert(
          'Éxito',
          'Tablero creado correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpiar formulario
                setFormData({
                  nombre: '',
                  ubicacion: '',
                  marca: '',
                  capacidad_amperios: '',
                  ano_fabricacion: new Date().getFullYear().toString(),
                  ano_instalacion: new Date().getFullYear().toString(),
                  estado: 'Operativo',
                });
                
                // Navegar a la lista de tableros
                navigation.navigate('Tableros');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear el tablero');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al crear el tablero');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Limpiar formulario',
      '¿Estás seguro de limpiar todos los campos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          onPress: () => {
            setFormData({
              nombre: '',
              ubicacion: '',
              marca: '',
              capacidad_amperios: '',
              ano_fabricacion: new Date().getFullYear().toString(),
              ano_instalacion: new Date().getFullYear().toString(),
              estado: 'Operativo',
            });
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Ionicons name="add-circle" size={28} color="#667eea" />
        <Text style={styles.headerTitle}>Crear Tablero</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color="#667eea" />
            <Text style={styles.sectionTitle}>Información General</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Tablero Piso 1 - Ala Norte"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ubicación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sala de máquinas, Sótano 1"
              value={formData.ubicacion}
              onChangeText={(value) => handleInputChange('ubicacion', value)}
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Marca *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Schneider Electric"
              value={formData.marca}
              onChangeText={(value) => handleInputChange('marca', value)}
              placeholderTextColor="#a0aec0"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={22} color="#667eea" />
            <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Capacidad (Amperios) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 200"
              value={formData.capacidad_amperios}
              onChangeText={(value) => handleInputChange('capacidad_amperios', value)}
              keyboardType="numeric"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Año de Fabricación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2020"
              value={formData.ano_fabricacion}
              onChangeText={(value) => handleInputChange('ano_fabricacion', value)}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Año de Instalación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2021"
              value={formData.ano_instalacion}
              onChangeText={(value) => handleInputChange('ano_instalacion', value)}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estado *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
                style={styles.picker}
              >
                {estadoOptions.map((estado) => (
                  <Picker.Item key={estado} label={estado} value={estado} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClear}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color="#f56565" />
            <Text style={[styles.actionButtonText, styles.clearButtonText]}>
              Limpiar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Guardar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e8ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e8ecef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButton: {
    backgroundColor: '#667eea',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f56565',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButtonText: {
    color: '#f56565',
  },
});

export default CreateTableroView;
