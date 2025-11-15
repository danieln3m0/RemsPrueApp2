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
 * @param {Object} props.navig ation - Objeto de navegación de React Navigation
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
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  
  /** @type {number} Número de página actual para infinite scroll */
  const [page, setPage] = useState(1);
  
  /** @type {string} Término de búsqueda */
  const [searchTerm, setSearchTerm] = useState('');
  
  /** @type {string|null} Año seleccionado para filtrar */
  const [selectedYear, setSelectedYear] = useState(null);
  
  /** @type {boolean} Estado del modal de filtros */
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  /** @type {number} Altura del SafeAreaView para calcular offset del header */
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  
  /** @type {boolean} Estado para mostrar el botón de activación del API */
  const [showActivateButton, setShowActivateButton] = useState(true);
  
  /** @type {boolean} Estado para indicar si se está activando el API */
  const [isActivatingAPI, setIsActivatingAPI] = useState(false);
  
  /** @const {number} Número de items a mostrar por página */
  const ITEMS_PER_PAGE = 10;
  
  /** React Query hook para obtener tableros con caché automático */
  const { data, isLoading, isError, refetch } = useTableros();
  
  /** React Query mutation para eliminar tableros con invalidación de caché */
  const deleteTableroMutation = useDeleteTablero();
  
  /** Extracción segura de tableros desde la respuesta de la API */
  const tableros = Array.isArray(data) ? data : [];
  
  /** @type {Array} Array de tableros filtrados por búsqueda y año */
  const filteredTableros = React.useMemo(() => {
    if (!tableros || tableros.length === 0) return [];
    
    let filtered = tableros;
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tablero =>
        tablero.nombre.toLowerCase().includes(searchLower) ||
        tablero.ubicacion.toLowerCase().includes(searchLower) ||
        tablero.marca.toLowerCase().includes(searchLower) ||
        tablero.estado.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por año de fabricación
    if (selectedYear) {
      filtered = filtered.filter(tablero => 
        tablero.ano_fabricacion.toString() === selectedYear
      );
    }
    
    return filtered;
  }, [tableros, searchTerm, selectedYear]);
  
  /** @type {Array} Array de tableros mostrados actualmente (con paginación) - calculado directamente */
  const displayedTableros = React.useMemo(() => {
    if (!filteredTableros || filteredTableros.length === 0) return [];
    return filteredTableros.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredTableros, page]);
  
  /** @type {Array} Array de años únicos disponibles para filtrar */
  const availableYears = React.useMemo(() => {
    if (!tableros || tableros.length === 0) return [];
    const years = [...new Set(tableros.map(t => t.ano_fabricacion.toString()))];
    return years.sort((a, b) => b.localeCompare(a)); // Orden descendente
  }, [tableros]);
  
  /** Animated.Value para controlar la animación del header */
  const scrollY = useRef(new Animated.Value(0)).current;
  const baseHeaderHeight = 140; // Altura base del contenido del header + padding adicional
  const totalHeaderHeight = baseHeaderHeight + safeAreaHeight; // Altura total incluyendo SafeArea
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, totalHeaderHeight],
    outputRange: [0, -totalHeaderHeight],
    extrapolate: 'clamp',
  });

  /**
   * Efecto para resetear la paginación cuando cambian los datos o filtros
   * Solo maneja el reset del número de página, no el estado derivado
   */
  React.useEffect(() => {
    setPage(1);
  }, [data, isLoading, searchTerm, selectedYear]);

  /**
   * Carga más items de la lista (infinite scroll)
   * Se ejecuta cuando el usuario llega al final de la lista
   * Agrega los siguientes 10 items al array displayedTableros
   * 
   * @function
   */
  const loadMoreTableros = () => {
    if (!filteredTableros || displayedTableros.length >= filteredTableros.length) return;
    setPage(prevPage => prevPage + 1);
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

  /**
   * Limpia todos los filtros aplicados
   */
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear(null);
  };

  /**
   * Aplica filtro por año y cierra el modal
   */
  const applyYearFilter = (year) => {
    setSelectedYear(year);
    setIsFilterModalVisible(false);
  };

  /**
   * Activa el API del backend para sacarlo del estado de espera
   * Hace una llamada inicial para "despertar" el servidor
   */
  const activateAPI = async () => {
    setIsActivatingAPI(true);
    try {
      // Hacer una llamada directa al API para activarlo
      await fetch('https://remsprueback.onrender.com/tableros/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      // Esperar un momento para que el servidor se active completamente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ocultar el botón y refrescar los datos
      setShowActivateButton(false);
      refetch();
    } catch (error) {
      console.log('Error activando API, pero continuamos:', error);
      // Aun si hay error, ocultamos el botón y intentamos refrescar
      setShowActivateButton(false);
      refetch();
    } finally {
      setIsActivatingAPI(false);
    }
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
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        // Calculamos la altura del SafeAreaView superior
        const safeHeight = Math.max(0, height - (baseHeaderHeight + 40)); // 40 es padding adicional
        setSafeAreaHeight(safeHeight > 0 ? 0 : 44); // Estimación para dispositivos con notch
      }}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Animated.View 
          style={[
            styles.header, 
            { 
              backgroundColor: theme.colors.card, 
              borderBottomColor: theme.colors.border,
              transform: [{ translateY: headerTranslateY }],
              paddingTop: 20, // Padding fijo ya que SafeAreaView maneja el espacio superior
            }
          ]}
        >
        <View style={styles.headerTop}>
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
        </View>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Buscar tableros..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.filterButton, { 
              backgroundColor: selectedYear ? theme.colors.primary : theme.colors.cardBackground,
              borderColor: theme.colors.border
            }]}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={selectedYear ? '#ffffff' : theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
        
        {(searchTerm || selectedYear) && (
          <View style={styles.filtersActive}>
            <View style={styles.activeFiltersContainer}>
              {searchTerm && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.activeFilterText}>"{searchTerm}"</Text>
                </View>
              )}
              {selectedYear && (
                <View style={[styles.activeFilter, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.activeFilterText}>Año: {selectedYear}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
              <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {!isLoading && filteredTableros.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={80} color={theme.colors.border} />
          {tableros.length === 0 ? (
            <>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No hay tableros registrados</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                {showActivateButton ? 'Primero activa el servidor para cargar los datos' : 'Usa la pestaña "Crear" para agregar uno nuevo'}
              </Text>
              {showActivateButton && (
                <TouchableOpacity 
                  style={[styles.activateButton, { backgroundColor: theme.colors.primary }]}
                  onPress={activateAPI}
                  disabled={isActivatingAPI}
                >
                  {isActivatingAPI ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons name="power" size={20} color="#ffffff" />
                  )}
                  <Text style={styles.activateButtonText}>
                    {isActivatingAPI ? 'Activando servidor...' : 'Activar Servidor'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No se encontraron resultados</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Intenta ajustar los filtros de búsqueda
              </Text>
              {(searchTerm || selectedYear) && (
                <TouchableOpacity onPress={clearFilters} style={[styles.clearButton, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.clearButtonText}>Limpiar filtros</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      ) : (
        <Animated.FlatList
          data={displayedTableros}
          renderItem={renderTablero}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingTop: totalHeaderHeight }]}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => refetch()}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressViewOffset={totalHeaderHeight}
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
            displayedTableros.length < filteredTableros.length && displayedTableros.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.footerText, { color: theme.colors.primary }]}>Cargando más...</Text>
              </View>
            ) : null
          }
        />
      )}
      
      {/* Modal de filtros por año */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filtrar por Año</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={[{ year: null, label: 'Todos los años' }, ...availableYears.map(year => ({ year, label: year }))]}
              keyExtractor={(item) => item.year?.toString() || 'all'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearOption,
                    { borderBottomColor: theme.colors.border },
                    selectedYear === item.year && { backgroundColor: theme.colors.cardBackground }
                  ]}
                  onPress={() => applyYearFilter(item.year)}
                >
                  <Text style={[
                    styles.yearOptionText,
                    { color: theme.colors.text },
                    selectedYear === item.year && { fontWeight: 'bold', color: theme.colors.primary }
                  ]}>
                    {item.label}
                  </Text>
                  {selectedYear === item.year && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    minHeight: 140,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  filtersActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeFiltersContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilter: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  activeFilterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersButton: {
    padding: 4,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  yearOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  yearOptionText: {
    fontSize: 16,
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
