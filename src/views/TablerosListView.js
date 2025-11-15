// View: Lista de Tableros (Dashboard)
// Vista 2: Muestra la lista de tableros con opciones de editar y eliminar

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TableroController from '../controllers/TableroController';

const TablerosListView = ({ navigation }) => {
  const [tableros, setTableros] = useState([]);
  const [displayedTableros, setDisplayedTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Cargar tableros
  const loadTableros = async () => {
    try {
      const result = await TableroController.getTableros();
      
      if (result.success) {
        setTableros(result.data);
        // Cargar primeros items
        setDisplayedTableros(result.data.slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } else {
        Alert.alert('Error', result.error || 'No se pudieron cargar los tableros');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar más items (infinite scroll)
  const loadMoreTableros = () => {
    if (loadingMore || displayedTableros.length >= tableros.length) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = tableros.slice(startIndex, endIndex);
      
      setDisplayedTableros([...displayedTableros, ...newItems]);
      setPage(nextPage);
      setLoadingMore(false);
    }, 500); // Pequeño delay para simular carga
  };

  // Cargar al montar y cuando se enfoca la pantalla
  useFocusEffect(
    useCallback(() => {
      loadTableros();
    }, [])
  );

  // Refrescar lista
  const onRefresh = () => {
    setRefreshing(true);
    loadTableros();
  };

  // Manejar eliminación
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
          onPress: async () => {
            try {
              const result = await TableroController.deleteTablero(tablero.id);
              
              if (result.success) {
                Alert.alert('Éxito', 'Tablero eliminado correctamente');
                loadTableros(); // Refrescar lista
              } else {
                Alert.alert('Error', result.error || 'No se pudo eliminar el tablero');
              }
            } catch (error) {
              Alert.alert('Error', 'Error al eliminar el tablero');
            }
          },
        },
      ]
    );
  };

  // Manejar edición
  const handleEdit = (tablero) => {
    navigation.navigate('EditTablero', { tablero });
  };

  // Renderizar cada item de la lista
  const renderTablero = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={24} color="#667eea" />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.tableroNombre}>{item.nombre}</Text>
          <View style={styles.ubicacionContainer}>
            <Ionicons name="location-outline" size={16} color="#8492a6" />
            <Text style={styles.tableroUbicacion}>{item.ubicacion}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Marca:</Text>
          <Text style={styles.infoValue}>{item.marca}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Capacidad:</Text>
          <Text style={styles.infoValue}>{item.capacidad_amperios} A</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <View style={[styles.estadoBadge, 
            item.estado === 'Operativo' && styles.estadoOperativo,
            item.estado === 'Mantenimiento' && styles.estadoMantenimiento,
            item.estado === 'Fuera de servicio' && styles.estadoFueraServicio
          ]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fabricación:</Text>
          <Text style={styles.infoValue}>{item.ano_fabricacion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Instalación:</Text>
          <Text style={styles.infoValue}>{item.ano_instalacion}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando tableros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="grid" size={28} color="#667eea" />
        <Text style={styles.headerTitle}>Tableros Eléctricos</Text>
      </View>

      {tableros.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={80} color="#cbd5e0" />
          <Text style={styles.emptyText}>No hay tableros registrados</Text>
          <Text style={styles.emptySubtext}>
            Usa la pestaña "Crear" para agregar uno nuevo
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedTableros}
          renderItem={renderTablero}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#667eea']}
              tintColor="#667eea"
            />
          }
          onEndReached={loadMoreTableros}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            loadingMore && displayedTableros.length < tableros.length ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.footerText}>Cargando más...</Text>
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
    backgroundColor: '#f5f7fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
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
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecef',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#edf2f7',
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
    color: '#2c3e50',
    marginBottom: 4,
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableroUbicacion: {
    fontSize: 14,
    color: '#8492a6',
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
    color: '#8492a6',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
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
    borderTopColor: '#e8ecef',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  editButton: {
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#f56565',
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
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8492a6',
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
    color: '#667eea',
    fontWeight: '600',
  },
});

export default TablerosListView;
