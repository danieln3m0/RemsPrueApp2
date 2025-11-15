/**
 * TableroElectricoModel - Modelo de datos para tableros eléctricos
 * 
 * Define la estructura y reglas de validación para los tableros eléctricos.
 * Proporciona métodos para validar datos, convertir entre formatos JSON y objetos,
 * y garantizar la integridad de los datos antes de enviarlos a la API.
 * 
 * @class
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */
class TableroElectricoModel {
  /**
   * Constructor del modelo de tablero eléctrico
   * @param {Object} data - Datos iniciales del tablero
   * @param {string} [data.id] - Identificador único del tablero
   * @param {string} [data.nombre] - Nombre descriptivo del tablero
   * @param {string} [data.ubicacion] - Ubicación física del tablero
   * @param {string} [data.marca] - Marca del fabricante
   * @param {number} [data.capacidad_amperios] - Capacidad en amperios
   * @param {number} [data.ano_fabricacion] - Año de fabricación
   * @param {number} [data.ano_instalacion] - Año de instalación
   * @param {string} [data.estado] - Estado operativo: 'Operativo', 'Mantenimiento', 'Fuera de servicio'
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || '';
    this.ubicacion = data.ubicacion || '';
    this.marca = data.marca || '';
    this.capacidad_amperios = data.capacidad_amperios || 0;
    this.ano_fabricacion = data.ano_fabricacion || new Date().getFullYear();
    this.ano_instalacion = data.ano_instalacion || new Date().getFullYear();
    this.estado = data.estado || 'Operativo';
  }

  /**
   * Valida los datos del tablero eléctrico
   * 
   * Verifica que todos los campos requeridos estén presentes y cumplan
   * con las reglas de negocio (rangos válidos, coherencia de fechas, etc.)
   * 
   * @returns {Object} Resultado de la validación
   * @returns {boolean} returns.isValid - Indica si los datos son válidos
   * @returns {Array<string>} returns.errors - Lista de errores encontrados
   */
  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre es requerido');
    }
    
    if (!this.ubicacion || this.ubicacion.trim() === '') {
      errors.push('La ubicación es requerida');
    }
    
    if (!this.marca || this.marca.trim() === '') {
      errors.push('La marca es requerida');
    }
    
    if (!this.capacidad_amperios || this.capacidad_amperios <= 0) {
      errors.push('La capacidad en amperios debe ser mayor a 0');
    }
    
    if (!this.ano_fabricacion || this.ano_fabricacion < 1900) {
      errors.push('El año de fabricación no es válido');
    }
    
    if (!this.ano_instalacion || this.ano_instalacion < 1900) {
      errors.push('El año de instalación no es válido');
    }
    
    if (this.ano_instalacion < this.ano_fabricacion) {
      errors.push('El año de instalación no puede ser anterior al año de fabricación');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte el modelo a formato JSON para la API
   * 
   * Serializa el objeto a un formato compatible con la API REST.
   * Solo incluye el ID si existe (útil para diferenciar creación de actualización).
   * 
   * @returns {Object} Objeto JSON con los datos del tablero
   */
  toJSON() {
    const json = {
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      marca: this.marca,
      capacidad_amperios: this.capacidad_amperios,
      ano_fabricacion: this.ano_fabricacion,
      ano_instalacion: this.ano_instalacion,
      estado: this.estado
    };
    
    // Solo incluir el ID si existe (para actualizaciones)
    if (this.id) {
      json.id = this.id;
    }
    
    return json;
  }

  /**
   * Crea una instancia del modelo desde datos JSON de la API
   * 
   * Método estático factory para crear instancias del modelo
   * a partir de respuestas de la API.
   * 
   * @static
   * @param {Object} json - Datos JSON recibidos de la API
   * @returns {TableroElectricoModel} Nueva instancia del modelo
   */
  static fromJSON(json) {
    return new TableroElectricoModel(json);
  }
}

/**
 * Exporta la clase TableroElectricoModel
 * @type {TableroElectricoModel}
 */
export default TableroElectricoModel;
