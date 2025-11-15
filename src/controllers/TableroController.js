/**
 * TableroController - Controlador para la gestión de tableros eléctricos
 * 
 * Implementa la lógica de negocio en el patrón MVC. Actúa como intermediario
 * entre las vistas y el servicio de API, aplicando validaciones, transformaciones
 * de datos y manejo de errores antes de interactuar con la capa de servicios.
 * 
 * @class
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import TableroService from '../services/TableroService';
import TableroElectricoModel from '../models/TableroElectricoModel';

class TableroController {
  /**
   * Obtiene todos los tableros eléctricos
   * 
   * Recupera la lista completa de tableros desde la API y los convierte
   * en instancias del modelo para garantizar consistencia de datos.
   * 
   * @async
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si la operación fue exitosa
   * @returns {Array<TableroElectricoModel>} returns.data - Array de tableros
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async getTableros() {
    const result = await TableroService.getAllTableros();
    
    if (result.success) {
      // Convertir los datos a instancias del modelo
      const tableros = result.data.map(tableroData => 
        TableroElectricoModel.fromJSON(tableroData)
      );
      
      return {
        success: true,
        data: tableros,
        error: null
      };
    }
    
    return result;
  }

  /**
   * Crea un nuevo tablero eléctrico
   * 
   * Valida los datos del tablero antes de enviarlo a la API.
   * Si la validación falla, retorna los errores sin hacer la llamada HTTP.
   * 
   * @async
   * @param {Object} tableroData - Datos del nuevo tablero
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se creó exitosamente
   * @returns {TableroElectricoModel|null} returns.data - Tablero creado
   * @returns {string|null} returns.error - Errores de validación o de API
   */
  async createTablero(tableroData) {
    // Crear instancia del modelo
    const tablero = new TableroElectricoModel(tableroData);
    
    // Validar datos
    const validation = tablero.validate();
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: validation.errors.join(', ')
      };
    }
    
    // Llamar al servicio
    const result = await TableroService.createTablero(tablero.toJSON());
    
    if (result.success) {
      return {
        success: true,
        data: TableroElectricoModel.fromJSON(result.data),
        error: null
      };
    }
    
    return result;
  }

  /**
   * Actualiza un tablero eléctrico existente
   * 
   * Valida los datos actualizados antes de enviarlos a la API.
   * Combina el ID del tablero con los nuevos datos para la validación.
   * 
   * @async
   * @param {string} tableroId - ID único del tablero a actualizar
   * @param {Object} tableroData - Datos actualizados del tablero
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se actualizó exitosamente
   * @returns {TableroElectricoModel|null} returns.data - Tablero actualizado
   * @returns {string|null} returns.error - Errores de validación o de API
   */
  async updateTablero(tableroId, tableroData) {
    // Crear instancia del modelo
    const tablero = new TableroElectricoModel({
      ...tableroData,
      id: tableroId
    });
    
    // Validar datos
    const validation = tablero.validate();
    if (!validation.isValid) {
      return {
        success: false,
        data: null,
        error: validation.errors.join(', ')
      };
    }
    
    // Llamar al servicio
    const result = await TableroService.updateTablero(tableroId, tablero.toJSON());
    
    if (result.success) {
      return {
        success: true,
        data: TableroElectricoModel.fromJSON(result.data),
        error: null
      };
    }
    
    return result;
  }

  /**
   * Elimina un tablero eléctrico
   * 
   * Valida que el ID sea válido antes de intentar la eliminación.
   * La eliminación es permanente y no se puede deshacer.
   * 
   * @async
   * @param {string} tableroId - ID único del tablero a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {boolean} returns.success - Indica si se eliminó exitosamente
   * @returns {null} returns.data - Siempre null para operaciones DELETE
   * @returns {string|null} returns.error - Mensaje de error si ocurrió alguno
   */
  async deleteTablero(tableroId) {
    if (!tableroId) {
      return {
        success: false,
        data: null,
        error: 'ID de tablero no válido'
      };
    }
    
    const result = await TableroService.deleteTablero(tableroId);
    return result;
  }

  /**
   * Valida datos de tablero sin hacer llamadas a la API
   * 
   * Útil para validación en tiempo real en formularios,
   * sin consumir recursos de red.
   * 
   * @param {Object} tableroData - Datos del tablero a validar
   * @returns {Object} Resultado de la validación
   * @returns {boolean} returns.isValid - Indica si los datos son válidos
   * @returns {Array<string>} returns.errors - Lista de errores encontrados
   */
  validateTableroData(tableroData) {
    const tablero = new TableroElectricoModel(tableroData);
    return tablero.validate();
  }
}

/**
 * Exporta una instancia única del controlador (Singleton)
 * @type {TableroController}
 */
export default new TableroController();
