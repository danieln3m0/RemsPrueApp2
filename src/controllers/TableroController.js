// Controller: Tablero Controller
// Maneja la lógica de negocio entre el Service y las Views

import TableroService from '../services/TableroService';
import TableroElectricoModel from '../models/TableroElectricoModel';

class TableroController {
  // Obtener todos los tableros
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

  // Crear un nuevo tablero
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

  // Actualizar un tablero existente
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

  // Eliminar un tablero
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

  // Validar datos de tablero sin hacer la llamada a la API
  validateTableroData(tableroData) {
    const tablero = new TableroElectricoModel(tableroData);
    return tablero.validate();
  }
}

export default new TableroController();
