/**
 * CreateTableroView - Vista de creación de tableros eléctricos
 * 
 * Vista 3: Formulario completo para crear nuevos tableros eléctricos.
 * Incluye validación de campos, integración con React Query para crear registros,
 * animación de header que se oculta al hacer scroll, y soporte para tema dinámico.
 * Al completarse exitosamente, redirige automáticamente a la lista de tableros.
 * 
 * @component
 * @module views/CreateTableroView
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.navigation - Objeto de navegación de React Navigation
 * @param {Function} props.navigation.navigate - Función para navegar entre pantallas
 * 
 * @returns {React.Component} Formulario de creación de tablero
 * 
 * @example
 * // Uso en tab navigator
 * <Tab.Screen name="Crear" component={CreateTableroView} />
 */

import React, { useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';
import { useCreateTablero } from '../hooks/useTableros';

/**
 * Componente funcional del formulario de creación de tableros
 * 
 * Características:
 * - Formulario con validación de todos los campos requeridos
 * - React Query mutation para crear tableros con caché automático
 * - Header animado que se oculta/muestra al hacer scroll
 * - Tema dinámico (claro/oscuro)
 * - Valores predeterminados para años (año actual)
 * - Estado predeterminado: "Operativo"
 * - Indicador de carga durante envío (ActivityIndicator)
 * - Navegación automática al Dashboard después de crear
 * - Botón de limpiar formulario con confirmación
 * 
 * @function
 */
const CreateTableroView = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  /** React Query mutation hook para crear tableros */
  const createTableroMutation = useCreateTablero();
  
  /** Animated.Value para controlar la animación del header */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 80;
  
  /** Interpolación para translateY del header animado */
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });
  
  /**
   * Estado del formulario con valores iniciales
   * @type {Object}
   * @property {string} nombre - Nombre del tablero
   * @property {string} ubicacion - Ubicación física del tablero
   * @property {string} marca - Marca del fabricante
   * @property {string} capacidad_amperios - Capacidad en amperios (como string para input)
   * @property {string} ano_fabricacion - Año de fabricación
   * @property {string} ano_instalacion - Año de instalación
   * @property {string} estado - Estado actual (Operativo, Mantenimiento, Fuera de servicio)
   */
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    marca: '',
    capacidad_amperios: '',
    ano_fabricacion: new Date().getFullYear().toString(),
    ano_instalacion: new Date().getFullYear().toString(),
    estado: 'Operativo',
  });

  /** @const {Array<string>} Opciones disponibles para el estado del tablero */
  const estadoOptions = ['Operativo', 'Mantenimiento', 'Fuera de servicio'];

  /**
   * Actualiza un campo específico del formulario
   * 
   * @function
   * @param {string} field - Nombre del campo a actualizar
   * @param {string} value - Nuevo valor para el campo
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Maneja el envío del formulario con validación completa
   * 
   * Validaciones:
   * - Nombre: no vacío
   * - Ubicación: no vacía
   * - Marca: no vacía
   * - Capacidad: debe ser un número válido
   * 
   * Después de validar, convierte los campos numéricos de string a int,
   * ejecuta la mutation de React Query, limpia el formulario al completarse
   * exitosamente, y navega automáticamente al Dashboard.
   * 
   * @function
   * @async
   */
  const handleSubmit = () => {
    // Validar campos requeridos
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

    // Preparar datos para API: convertir strings a números
    const dataToSend = {
      ...formData,
      capacidad_amperios: parseInt(formData.capacidad_amperios),
      ano_fabricacion: parseInt(formData.ano_fabricacion),
      ano_instalacion: parseInt(formData.ano_instalacion),
    };

    // Ejecutar mutation con callbacks de éxito/error
    createTableroMutation.mutate(dataToSend, {
      onSuccess: () => {
        Alert.alert(
          'Éxito',
          'Tablero creado correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reiniciar formulario con valores predeterminados
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
                navigation.navigate('Dashboard');
              },
            },
          ]
        );
      },
      onError: () => {
        Alert.alert('Error', 'No se pudo crear el tablero');
      },
    });
  };

  /**
   * Limpia todos los campos del formulario
   * Muestra un Alert de confirmación antes de resetear los valores.
   * Restaura los valores predeterminados (año actual, estado "Operativo").
   * 
   * @function
   */
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View 
        style={[
          styles.header, 
          { 
            backgroundColor: theme.colors.card, 
            borderBottomColor: theme.colors.border,
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Crear Tablero</Text>
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDarkMode ? 'sunny' : 'moon'} 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 96 }]}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Información General</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Nombre *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: Tablero Piso 1 - Ala Norte"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Ubicación *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: Sala de máquinas, Sótano 1"
              value={formData.ubicacion}
              onChangeText={(value) => handleInputChange('ubicacion', value)}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Marca *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: Schneider Electric"
              value={formData.marca}
              onChangeText={(value) => handleInputChange('marca', value)}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={22} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Especificaciones Técnicas</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Capacidad (Amperios) *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: 200"
              value={formData.capacidad_amperios}
              onChangeText={(value) => handleInputChange('capacidad_amperios', value)}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Año de Fabricación *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: 2020"
              value={formData.ano_fabricacion}
              onChangeText={(value) => handleInputChange('ano_fabricacion', value)}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Año de Instalación *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Ej: 2021"
              value={formData.ano_instalacion}
              onChangeText={(value) => handleInputChange('ano_instalacion', value)}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Estado *</Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
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
            disabled={createTableroMutation.isPending}
          >
            <Ionicons name="refresh" size={20} color="#f56565" />
            <Text style={[styles.actionButtonText, styles.clearButtonText]}>
              Limpiar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={createTableroMutation.isPending}
          >
            {createTableroMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Guardar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
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
