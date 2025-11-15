/**
 * TablerosListView - Vista de lista de tableros eléctricos
 * 
 * Vista 2: Muestra la lista de tableros eléctricos con funcionalidad CRUD completa.
 * Utiliza React Query para gestión de estado asíncrono y caché automático.
 * Implementa infinite scroll para paginación (10 items por página),
 * animación de header que se oculta al hacer scroll, y pull-to-refresh.
 * 
 * @component
 * @module views/TablerosListView
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.navigation - Objeto de navegación de React Navigation
 * @param {Function} props.navigation.navigate - Función para navegar entre pantallas
 * 
 * @returns {React.Component} Vista de lista de tableros con CRUD
 * 
 * @example
 * // Uso en stack navigator
 * <Stack.Screen name="Tableros" component={TablerosListView} />
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTableros, useDeleteTablero } from '../hooks/useTableros';

/**
 * Componente funcional principal de la lista de tableros
 * 
 * Características:
 * - React Query para caché y sincronización con el backend
 * - Infinite scroll con paginación de 10 items por página
 * - Header animado que se oculta/muestra según el scroll
 * - Pull-to-refresh para recargar datos
 * - Tema dinámico (claro/oscuro)
 * - Confirmación antes de eliminar tableros
 * - Navegación a vista de edición con datos pre-cargados
 * 
 * @function
 */
const TablerosListView = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  /** @type {Array} Array de tableros mostrados actualmente (con paginación) */
  const [displayedTableros, setDisplayedTableros] = useState([]);
  
  /** @type {number} Número de página actual para infinite scroll */
  const [page, setPage] = useState(1);
  
  /** @const {number} Número de items a mostrar por página */
  const ITEMS_PER_PAGE = 10;
  
  /** React Query hook para obtener tableros con caché automático */
  const { data, isLoading, isError, refetch } = useTableros();
  
  /** React Query mutation para eliminar tableros con invalidación de caché */
  const deleteTableroMutation = useDeleteTablero();
  
  /** Extracción segura de tableros desde la respuesta de la API */
  const tableros = Array.isArray(data) ? data : [];
  
  /** Animated.Value para controlar la animación del header */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 80;
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  /**
   * Efecto que actualiza los items mostrados cuando cambian los datos
   * Reinicia la paginación mostrando los primeros 10 items al recibir datos nuevos
   */
  React.useEffect(() => {
    if (!isLoading && tableros && tableros.length > 0) {
      const initial = tableros.slice(0, ITEMS_PER_PAGE);
      setDisplayedTableros(initial);
      setPage(1);
    } else if (!isLoading) {
      setDisplayedTableros([]);
    }
  }, [data, isLoading]);

  /**
   * Carga más items de la lista (infinite scroll)
   * Se ejecuta cuando el usuario llega al final de la lista
   * Agrega los siguientes 10 items al array displayedTableros
   * 
   * @function
   */
  const loadMoreTableros = () => {
    if (!tableros || displayedTableros.length >= tableros.length) return;

    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = tableros.slice(startIndex, endIndex);
    
    setDisplayedTableros([...displayedTableros, ...newItems]);
    setPage(nextPage);
  };

  /**
   * Maneja la eliminación de un tablero
   * Muestra un Alert de confirmación antes de ejecutar la eliminación.
   * Utiliza React Query mutation que invalida automáticamente el caché.
   * 
   * @function
   * @param {Object} tablero - Objeto tablero a eliminar
   * @param {string} tablero.id - ID del tablero
   * @param {string} tablero.nombre - Nombre del tablero (para mostrar en confirmación)
   */
  const handleDelete = (tablero) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el tablero "${tablero.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteTableroMutation.mutate(tablero.id, {
              onSuccess: () => {
                Alert.alert('Éxito', 'Tablero eliminado correctamente');
              },
            });
          },
        },
      ]
    );
  };

  /**
   * Navega a la vista de edición con los datos del tablero
   * Pasa el objeto tablero completo como parámetro de navegación
   * 
   * @function
   * @param {Object} tablero - Objeto tablero a editar
   */
  const handleEdit = (tablero) => {
    navigation.navigate('EditTablero', { tablero });
  };

  // Renderizar cada item de la lista
  const renderTablero = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.cardHeader, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? theme.colors.cardBackground : '#edf2f7' }]}>
          <Ionicons name="flash" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={[styles.tableroNombre, { color: theme.colors.text }]}>{item.nombre}</Text>
          <View style={styles.ubicacionContainer}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.tableroUbicacion, { color: theme.colors.textSecondary }]}>{item.ubicacion}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Marca:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{item.marca}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Capacidad:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{item.capacidad_amperios} A</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Estado:</Text>
          <View style={[styles.estadoBadge, 
            item.estado === 'Operativo' && styles.estadoOperativo,
            item.estado === 'Mantenimiento' && styles.estadoMantenimiento,
            item.estado === 'Fuera de servicio' && styles.estadoFueraServicio
          ]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Fabricación:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{item.ano_fabricacion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Instalación:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{item.ano_instalacion}</Text>
        </View>
      </View>

      <View style={[styles.cardActions, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>Cargando tableros...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle" size={80} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Error al cargar tableros</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
        <Ionicons name="grid" size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Tableros Eléctricos</Text>
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

      {!isLoading && tableros.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={80} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>No hay tableros registrados</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Usa la pestaña "Crear" para agregar uno nuevo
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={displayedTableros}
          renderItem={renderTablero}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingTop: headerHeight }]}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => refetch()}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressViewOffset={headerHeight}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onEndReached={loadMoreTableros}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            displayedTableros.length < tableros.length && displayedTableros.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.footerText, { color: theme.colors.primary }]}>Cargando más...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
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
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  tableroNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableroUbicacion: {
    fontSize: 14,
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoOperativo: {
    backgroundColor: '#48bb78',
  },
  estadoMantenimiento: {
    backgroundColor: '#ed8936',
  },
  estadoFueraServicio: {
    backgroundColor: '#f56565',
  },
  estadoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  editButton: {
    borderBottomLeftRadius: 12,
  },
  deleteButton: {
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TablerosListView;
