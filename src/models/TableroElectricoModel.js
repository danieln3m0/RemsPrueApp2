// Model: Tablero Electrico
// Define la estructura de datos de un tablero eléctrico

class TableroElectricoModel {
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

  // Valida que los campos requeridos estén presentes
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

  // Convierte el modelo a formato para la API
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

  // Crea una instancia desde datos de la API
  static fromJSON(json) {
    return new TableroElectricoModel(json);
  }
}

export default TableroElectricoModel;
