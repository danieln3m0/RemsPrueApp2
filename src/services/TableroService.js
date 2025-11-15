/**
 * TableroService - Servicio de API para tableros eléctricos
 * 
 * Capa de servicio que encapsula todas las llamadas HTTP a la API REST.
 * Maneja la comunicación con el backend, serialización/deserialización de datos,
 * manejo de errores HTTP y transformación de respuestas a formato estándar.
 * 
 * @class
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

/**
 * URL base de la API REST
 * @constant {string}
 */
const API_BASE_URL = 'https://remsprueback.onrender.com';

class TableroService {
  /**
   * Obtiene todos los tableros eléctricos de la API
   * 
   * Realiza una petición GET al endpoint de tableros.
   * Maneja errores de red y transforma la respuesta a formato estándar.
   * 
   * @async
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si la petición fue exitosa
   * @returns {Array|null} returns.data - Array de tableros o null si hay error
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async getAllTableros() {
    try {
      const response = await fetch(`${API_BASE_URL}/tableros/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener tableros: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      console.error('Error en getAllTableros:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Crea un nuevo tablero eléctrico en la API
   * 
   * Envía una petición POST con los datos del tablero.
   * Si el servidor devuelve detalles del error, los incluye en la respuesta.
   * 
   * @async
   * @param {Object} tableroData - Datos del tablero a crear
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se creó exitosamente
   * @returns {Object|null} returns.data - Tablero creado con ID asignado
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async createTablero(tableroData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tableros/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableroData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al crear tablero: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      console.error('Error en createTablero:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Actualiza un tablero eléctrico existente
   * 
   * Envía una petición PATCH con los datos actualizados.
   * Solo actualiza los campos proporcionados (actualización parcial).
   * 
   * @async
   * @param {string} tableroId - ID único del tablero a actualizar
   * @param {Object} tableroData - Datos actualizados del tablero
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se actualizó exitosamente
   * @returns {Object|null} returns.data - Tablero actualizado
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async updateTablero(tableroId, tableroData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tableros/${tableroId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableroData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al actualizar tablero: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      console.error('Error en updateTablero:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Elimina un tablero eléctrico de la API
   * 
   * Envía una petición DELETE al endpoint específico del tablero.
   * La eliminación es permanente y no se puede revertir.
   * Maneja respuestas vacías del servidor (común en operaciones DELETE).
   * 
   * @async
   * @param {string} tableroId - ID único del tablero a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se eliminó exitosamente
   * @returns {Object|null} returns.data - Mensaje de confirmación o null
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async deleteTablero(tableroId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tableros/${tableroId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar tablero: ${response.status}`);
      }

      // DELETE puede retornar vacío o un mensaje de confirmación
      const data = await response.json().catch(() => ({ message: 'Eliminado exitosamente' }));
      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      console.error('Error en deleteTablero:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }
}

/**
 * Exporta una instancia única del servicio (Singleton)
 * Garantiza que todas las peticiones HTTP usen la misma configuración
 * @type {TableroService}
 */
export default new TableroService();
