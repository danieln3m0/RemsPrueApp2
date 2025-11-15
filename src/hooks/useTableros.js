/**
 * useTableros - Custom Hooks para gestión de tableros eléctricos
 * 
 * Conjunto de hooks personalizados que utilizan React Query para manejar
 * el estado asíncrono de los tableros. Proporciona caché automático,
 * revalidación inteligente y gestión de estados de carga/error.
 * 
 * @module hooks/useTableros
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import TableroService from '../services/TableroService';

/**
 * Hook para obtener la lista de tableros
 * 
 * Utiliza React Query para cachear y gestionar el estado de la lista de tableros.
 * Los datos se mantienen frescos durante 5 minutos y en caché durante 10 minutos.
 * 
 * @returns {Object} Resultado de la query
 * @returns {Array} returns.data - Array de tableros
 * @returns {boolean} returns.isLoading - Indica si está cargando
 * @returns {boolean} returns.isError - Indica si hubo un error
 * @returns {Function} returns.refetch - Función para refrescar los datos manualmente
 * 
 * @example
 * const { data: tableros, isLoading, isError, refetch } = useTableros();
 */
export const useTableros = () => {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: async () => {
      const response = await TableroService.getAllTableros();
      
      // Si hay error, lanzar excepción para que React Query maneje el estado de error
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener tableros');
      }
      
      // Retornar directamente el array de datos
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para crear un nuevo tablero
 * 
 * Mutation hook que maneja la creación de tableros.
 * Invalida automáticamente el caché de tableros al completarse exitosamente,
 * provocando que la lista se recargue con los datos actualizados.
 * 
 * @returns {Object} Mutation object
 * @returns {Function} returns.mutate - Función para ejecutar la mutación
 * @returns {Function} returns.mutateAsync - Versión asíncrona de mutate
 * @returns {boolean} returns.isPending - Indica si la mutación está en progreso
 * @returns {boolean} returns.isError - Indica si hubo un error
 * @returns {boolean} returns.isSuccess - Indica si fue exitosa
 * 
 * @example
 * const createMutation = useCreateTablero();
 * createMutation.mutate(tableroData, {
 *   onSuccess: () => console.log('Tablero creado'),
 *   onError: (error) => console.error(error)
 * });
 */
export const useCreateTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableroData) => {
      return await TableroService.createTablero(tableroData);
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros automáticamente
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo crear el tablero');
      console.error('Error al crear tablero:', error);
    },
  });
};

/**
 * Hook para actualizar un tablero existente
 * 
 * Mutation hook que maneja la actualización de tableros.
 * Invalida el caché al completarse, asegurando que la UI muestre los datos más recientes.
 * 
 * @returns {Object} Mutation object
 * @returns {Function} returns.mutate - Función para ejecutar la mutación
 * @returns {boolean} returns.isPending - Indica si la mutación está en progreso
 * 
 * @example
 * const updateMutation = useUpdateTablero();
 * updateMutation.mutate({ id: '123', data: updatedData });
 */
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

/**
 * Hook para eliminar un tablero
 * 
 * Mutation hook que maneja la eliminación de tableros.
 * La eliminación es permanente y refresca automáticamente la lista.
 * 
 * @returns {Object} Mutation object
 * @returns {Function} returns.mutate - Función para ejecutar la eliminación
 * @returns {boolean} returns.isPending - Indica si la eliminación está en progreso
 * 
 * @example
 * const deleteMutation = useDeleteTablero();
 * deleteMutation.mutate(tableroId, {
 *   onSuccess: () => Alert.alert('Éxito', 'Tablero eliminado')
 * });
 */
export const useDeleteTablero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await TableroService.deleteTablero(id);
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de tableros automáticamente
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo eliminar el tablero');
      console.error('Error al eliminar tablero:', error);
    },
  });
};
