// Custom Hook: useTableros
// Gestiona el estado de los tableros usando React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import TableroService from '../services/TableroService';

// Hook para obtener tableros
export const useTableros = () => {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: async () => {
      const response = await TableroService.getAllTableros();
      // Retornar directamente el array de datos
      return response.success ? response.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear tablero
export const useCreateTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableroData) => {
      return await TableroService.createTablero(tableroData);
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo crear el tablero');
      console.error('Error al crear tablero:', error);
    },
  });
};

// Hook para actualizar tablero
export const useUpdateTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await TableroService.updateTablero(id, data);
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo actualizar el tablero');
      console.error('Error al actualizar tablero:', error);
    },
  });
};

// Hook para eliminar tablero
export const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await TableroService.deleteTablero(id);
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo eliminar el tablero');
      console.error('Error al eliminar tablero:', error);
    },
  });
};
