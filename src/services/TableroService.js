// Service: API Service for Tableros
// Maneja todas las llamadas HTTP a la API de tableros eléctricos

const API_BASE_URL = 'https://remsprueback.onrender.com';

class TableroService {
  // GET: Obtener todos los tableros
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

  // POST: Crear un nuevo tablero
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

  // PATCH: Actualizar un tablero existente
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

  // DELETE: Eliminar un tablero
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

      // DELETE puede retornar vacío o un mensaje
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

export default new TableroService();
